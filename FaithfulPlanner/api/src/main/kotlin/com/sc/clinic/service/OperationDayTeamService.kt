package com.sc.clinic.service

import com.sc.clinic.dto.OperationDayTeamDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.entity.OperationDayTeam
import com.sc.clinic.repository.OperationDayTeamRepository
import org.springframework.stereotype.Service

@Service
class OperationDayTeamService(
    val operationDayTeamRepository: OperationDayTeamRepository
) {
    fun deleteByTeamId(teamId: Long?): Long = teamId?.let { operationDayTeamRepository.deleteByTeamId(it) } ?: 0L

    fun save(operationDay: OperationDay, requiredOperationDayTeams: List<OperationDayTeamDto>): List<OperationDayTeam> {
        print(operationDay)
        print(requiredOperationDayTeams)
        TODO()
    }


}
