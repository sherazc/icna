package com.sc.clinic.service

import com.sc.clinic.dto.ScheduleDto
import com.sc.clinic.entity.Schedule
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.exception.ScException
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.EmployeeTypeRepository
import com.sc.clinic.repository.OperationDayTeamRepository
import com.sc.clinic.repository.ScheduleRepository
import com.sc.clinic.repository.TeamEmployeeTypeRepository
import com.sc.clinic.repository.TeamRepository
import com.sc.clinic.repository.UserProfileRepository
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val operationDayTeamRepository: OperationDayTeamRepository,
    private val teamEmployeeTypeRepository: TeamEmployeeTypeRepository,
    private val userProfileRepository: UserProfileRepository,
    private val teamRepository: TeamRepository,
    private val employeeTypeRepository: EmployeeTypeRepository
) {

    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    /** A spot is one employee type line of one team instance on an operation day. */
    private data class Spot(val teamId: Long, val employeeTypeId: Long, val teamInstanceNo: Int)

    fun deleteUserAllSchedules(userProfileId: Long): Int = scheduleRepository.deleteUserAllSchedules(userProfileId)
    fun deleteOperationDayAllSchedules(operationDayId: Long): Int =
        scheduleRepository.deleteOperationDayAllSchedules(operationDayId)

    /** Called before a user loses an employee type, so their spots of that type become Extra Users. */
    @Transactional
    fun unplaceUserEmployeeType(userProfileId: Long, employeeTypeId: Long) {
        scheduleRepository.unplaceByUserProfileIdAndEmployeeTypeId(userProfileId, employeeTypeId)
    }

    fun findByOperationDay(operationDayId: Long): List<ScheduleDto> =
        scheduleRepository.findByOperation(operationDayId)

    /**
     * Schedules a user on an operation day. When no spot is given, the first open spot matching
     * one of the user's employee types is used.
     */
    @Transactional
    fun scheduleUser(schedule: ScheduleDto): ScheduleDto {
        val existing = scheduleRepository.findEntityByOperationAndUser(schedule.operationDayId, schedule.userProfileId)
        if (existing?.team != null) {
            logger.warn("User already scheduled. OperationDayId=${schedule.operationDayId}, UserProfileId=${schedule.userProfileId}")
            return toDto(existing, schedule.operationDayId, schedule.userProfileId)
        }

        val user = findUser(schedule.userProfileId)
        val spot = if (schedule.teamId == null) {
            findFirstOpenSpot(schedule.operationDayId, user)
                ?: throw ScException("No open spot matches the employee types of the user. UserProfileId=${schedule.userProfileId}")
        } else {
            val requestedSpot = spotOf(schedule)
            requireOpenSpot(schedule.operationDayId, user, requestedSpot)
            requestedSpot
        }

        // An Extra User is already on the day without a spot, so their row is placed instead of inserted
        if (existing == null) {
            scheduleRepository.scheduleUser(
                schedule.operationDayId, schedule.userProfileId, spot.teamId, spot.employeeTypeId, spot.teamInstanceNo
            )
        } else {
            placeOn(existing, spot)
        }
        return scheduleRepository.findEntityByOperationAndUser(schedule.operationDayId, schedule.userProfileId)
            ?.let { toDto(it, schedule.operationDayId, schedule.userProfileId) }
            ?: throw ScException("Failed Schedule User. OperationDayId=${schedule.operationDayId}, UserProfileId=${schedule.userProfileId}")
    }

    /** Moves an already scheduled user to another open spot on the same operation day. */
    @Transactional
    fun moveUser(schedule: ScheduleDto): ScheduleDto {
        val current = scheduleRepository.findEntityByOperationAndUser(schedule.operationDayId, schedule.userProfileId)
            ?: throw ScException("User is not scheduled. OperationDayId=${schedule.operationDayId}, UserProfileId=${schedule.userProfileId}")
        val target = spotOf(schedule)

        val isSameSpot = current.team?.id == target.teamId
                && current.employeeType?.id == target.employeeTypeId
                && current.teamInstanceNo == target.teamInstanceNo
        if (!isSameSpot) {
            requireOpenSpot(schedule.operationDayId, current.userProfile, target)
            placeOn(current, target)
        }

        return toDto(current, schedule.operationDayId, schedule.userProfileId)
    }

    private fun placeOn(schedule: Schedule, spot: Spot) {
        schedule.team = teamRepository.findById(spot.teamId)
            .orElseThrow { ScException("Team not found. TeamId=${spot.teamId}") }
        schedule.employeeType = employeeTypeRepository.findById(spot.employeeTypeId)
            .orElseThrow { ScException("Employee type not found. EmployeeTypeId=${spot.employeeTypeId}") }
        schedule.teamInstanceNo = spot.teamInstanceNo
        scheduleRepository.saveAndFlush(schedule)
    }

    private fun toDto(schedule: Schedule, operationDayId: Long, userProfileId: Long) = ScheduleDto(
        schedule.id, operationDayId, userProfileId,
        schedule.team?.id, schedule.employeeType?.id, schedule.teamInstanceNo
    )

    private fun findUser(userProfileId: Long): UserProfile =
        userProfileRepository.findById(userProfileId)
            .orElseThrow { ScException("User not found. UserProfileId=$userProfileId") }

    private fun spotOf(schedule: ScheduleDto): Spot = Spot(
        schedule.teamId ?: throw ScException("Team is required"),
        schedule.employeeTypeId ?: throw ScException("Employee type is required"),
        schedule.teamInstanceNo ?: throw ScException("Team instance is required")
    )

    private fun requireOpenSpot(operationDayId: Long, user: UserProfile, spot: Spot) {
        if (user.employeeTypes.none { it.id == spot.employeeTypeId }) {
            throw ScException("User does not have the employee type of the spot. UserProfileId=${user.id}")
        }
        if (!lockSpotIfOpen(operationDayId, spot)) {
            throw ScException("Spot is not available. TeamId=${spot.teamId}, Instance=${spot.teamInstanceNo}, EmployeeTypeId=${spot.employeeTypeId}")
        }
    }

    private fun findFirstOpenSpot(operationDayId: Long, user: UserProfile): Spot? {
        val spots = operationDayTeamRepository.findByOperationDayId(operationDayId)
            .sortedBy { it.team.teamName }
            .flatMap { odt ->
                (1..odt.requiredTeamCount).flatMap { instanceNo ->
                    odt.team.teamEmployeeTypes
                        .filter { tet -> user.employeeTypes.any { it.id == tet.employeeType.id } }
                        .sortedBy { it.employeeType.typeName }
                        .map { Spot(odt.team.id!!, it.employeeType.id!!, instanceNo) }
                }
            }
        return spots.firstOrNull { lockSpotIfOpen(operationDayId, it) }
    }

    /**
     * Locks the team's operation day row so concurrent assignments to the same team are serialized,
     * then checks the spot exists and still has room. Returns true when the spot is open.
     */
    private fun lockSpotIfOpen(operationDayId: Long, spot: Spot): Boolean {
        val operationDayTeam = operationDayTeamRepository.findForUpdate(operationDayId, spot.teamId) ?: return false
        if (spot.teamInstanceNo < 1 || spot.teamInstanceNo > operationDayTeam.requiredTeamCount) return false
        val teamEmployeeType = teamEmployeeTypeRepository
            .findByTeamIdAndEmployeeTypeId(spot.teamId, spot.employeeTypeId) ?: return false
        val assignedCount = scheduleRepository.countAssigned(
            operationDayId, spot.teamId, spot.teamInstanceNo, spot.employeeTypeId
        )
        return assignedCount < teamEmployeeType.requiredEmployeeTypeCount
    }

    @Transactional
    fun unscheduleUser(operationDayId: Long, userProfileId: Long): Boolean {
        val deletedRecordsCount = scheduleRepository.unscheduleUser(operationDayId, userProfileId)
        return deletedRecordsCount > 0
    }
}
