package com.sc.clinic.service

import com.sc.clinic.dto.OperationDateDto
import org.springframework.stereotype.Service

@Service
class OperationDateService {
    fun save(companyId: Long, operationDateDto: OperationDateDto ): OperationDateDto {
        println(companyId)
        TODO()
    }
}