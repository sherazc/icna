package com.sc.clinic.service

import com.sc.clinic.repository.OperationDayTeamRepository
import org.springframework.stereotype.Service

@Service
class OperationDayTeamService (
    val operationDayTeamRepository: OperationDayTeamRepository
){
}