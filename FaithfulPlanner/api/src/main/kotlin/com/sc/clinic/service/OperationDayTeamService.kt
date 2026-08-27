package com.sc.clinic.service

import com.sc.clinic.dto.OperationDayTeamDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.entity.OperationDayTeam
import com.sc.clinic.entity.Team
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.OperationDayTeamRepository
import com.sc.clinic.repository.TeamRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class OperationDayTeamService(
    private val operationDayTeamRepository: OperationDayTeamRepository,
    private val teamRepository: TeamRepository
) {
    companion object {
        private val logger = LoggerFactory.getLogger(OperationDayTeamService::class.java)
    }

    fun deleteByTeamId(teamId: Long?): Long = teamId?.let { operationDayTeamRepository.deleteByTeamId(it) } ?: 0L
    fun deleteByOperationDayId(operationDayId: Long?): Long = operationDayId?.let { operationDayTeamRepository.deleteByOperationDayId(it) } ?: 0L

    fun save(operationDay: OperationDay, requiredOperationDayTeams: List<OperationDayTeamDto>): List<OperationDayTeam> {

        logger.info("Saving $requiredOperationDayTeams")
        val existingOdtList = operationDay.requiredOperationDayTeams

        // Delete Operation Teams
        val userDeletedExistingOdt = existingOdtList.filter { existingOdt ->
            requiredOperationDayTeams.none { otherTeam -> existingOdt.id == otherTeam.id }
        }
        userDeletedExistingOdt.forEach { odt ->  odt.id?.let { operationDayTeamRepository.deleteById(it) } }

        // Loop - Find or create
        val userCreateOrUpdatedOdtList: List<OperationDayTeam> = requiredOperationDayTeams.map {
            findOrCreate(operationDay, existingOdtList, it)
        }

        // Save
        return operationDayTeamRepository.saveAll(userCreateOrUpdatedOdtList)
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
