package com.sc.clinic.service

import com.sc.clinic.repository.OperationDayTeamRepository
import org.springframework.stereotype.Service

@Service
class OperationDayTeamService(
    val operationDayTeamRepository: OperationDayTeamRepository
) {
    fun deleteByTeamId(teamId: Long?): Long = teamId?.let { operationDayTeamRepository.deleteByTeamId(it) } ?: 0L
}
