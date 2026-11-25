package com.sc.clinic.service

import com.sc.clinic.dto.OperationDayTeamDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.entity.OperationDayTeam
import com.sc.clinic.entity.OperationDayTeamInstance
import com.sc.clinic.entity.OperationDayTeamInstanceId
import com.sc.clinic.entity.Team
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.OperationDayTeamInstanceRepository
import com.sc.clinic.repository.OperationDayTeamRepository
import com.sc.clinic.repository.ScheduleRepository
import com.sc.clinic.repository.TeamRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class OperationDayTeamService(
    private val operationDayTeamRepository: OperationDayTeamRepository,
    private val operationDayTeamInstanceRepository: OperationDayTeamInstanceRepository,
    private val scheduleRepository: ScheduleRepository,
    private val teamRepository: TeamRepository
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OperationDayTeamService::class.java)
    }

    fun deleteByTeamId(teamId: Long?): Long {
        if (teamId == null) return 0L
        scheduleRepository.unplaceByTeamId(teamId)
        operationDayTeamInstanceRepository.deleteByIdTeamId(teamId)
        return operationDayTeamRepository.deleteByTeamId(teamId)
    }

    fun deleteByOperationDayId(operationDayId: Long?): Long {
        if (operationDayId == null) return 0L
        operationDayTeamInstanceRepository.deleteByIdOperationDayId(operationDayId)
        return operationDayTeamRepository.deleteByOperationDayId(operationDayId)
    }

    fun save(operationDay: OperationDay, requiredOperationDayTeams: List<OperationDayTeamDto>): List<OperationDayTeam> {

        logger.info("Saving $requiredOperationDayTeams")
        val existingOdtList = operationDay.requiredOperationDayTeams

        // Delete Operation Teams
        val userDeletedExistingOdt = existingOdtList.filter { existingOdt ->
            requiredOperationDayTeams.none { otherTeam -> existingOdt.id == otherTeam.id }
        }
        userDeletedExistingOdt.forEach { odt -> removeOperationDayTeam(odt) }

        // Loop - Find or create
        val userCreateOrUpdatedOdtList: List<OperationDayTeam> = requiredOperationDayTeams.map {
            findOrCreate(operationDay, existingOdtList, it)
        }

        // Save
        val saved = operationDayTeamRepository.saveAll(userCreateOrUpdatedOdtList)
        saved.forEach { syncInstances(it) }
        return saved
    }

    private fun removeOperationDayTeam(odt: OperationDayTeam) {
        val operationDayId = odt.operationDay.id ?: return
        val teamId = odt.team.id ?: return
        scheduleRepository.unplaceByOperationDayIdAndTeamId(operationDayId, teamId)
        operationDayTeamInstanceRepository.deleteAll(
            operationDayTeamInstanceRepository.findByIdOperationDayIdAndIdTeamId(operationDayId, teamId)
        )
        odt.id?.let { operationDayTeamRepository.deleteById(it) }
    }

    // One instance row per team instance number 1..requiredTeamCount
    private fun syncInstances(odt: OperationDayTeam) {
        val operationDayId = odt.operationDay.id ?: return
        val teamId = odt.team.id ?: return
        val instances = operationDayTeamInstanceRepository.findByIdOperationDayIdAndIdTeamId(operationDayId, teamId)
        val existingInstanceNos = instances.map { it.id.instanceNo }.toSet()

        (1..odt.requiredTeamCount)
            .filter { it !in existingInstanceNos }
            .forEach {
                operationDayTeamInstanceRepository.save(
                    OperationDayTeamInstance(OperationDayTeamInstanceId(operationDayId, teamId, it))
                )
            }

        val removedInstances = instances.filter { it.id.instanceNo > odt.requiredTeamCount }
        if (removedInstances.isNotEmpty()) {
            scheduleRepository.unplaceByOperationDayIdAndTeamIdAboveInstance(
                operationDayId, teamId, odt.requiredTeamCount
            )
        }
        operationDayTeamInstanceRepository.deleteAll(removedInstances)
    }

    private fun findOrCreate(
        operationDay: OperationDay,
        existingOdtList: Set<OperationDayTeam>,
        requiredOdt: OperationDayTeamDto
    ): OperationDayTeam {

        val existingUpdated: OperationDayTeam? =
            existingOdtList.firstOrNull { existingOdt -> existingOdt.id == requiredOdt.id }
                ?.let { existingOdt ->
                    existingOdt.requiredTeamCount = requiredOdt.requiredTeamCount
                    existingOdt
                }
        return if (existingUpdated != null) existingUpdated else {
            val teamId = requiredOdt.team.id;
            if (teamId == null) {
                throw ScException("Failed to create Operation Day Team for ${operationDay.serviceDate}. Can not find team. Team id: $teamId")
            }
            val team: Team = findById(requiredOdt.team.id)
                ?: throw ScException("Failed to find team for ${operationDay.serviceDate}. Team id: $teamId")
            OperationDayTeam(null, operationDay, team, requiredOdt.requiredTeamCount)
        }
    }

    fun findById(teamId: Long?): Team? = teamId?.let { teamRepository.findById(it).orElse(null) }
}
