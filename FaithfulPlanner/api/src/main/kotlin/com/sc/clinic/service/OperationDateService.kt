package com.sc.clinic.service

import com.sc.clinic.dto.OperationDateDto
import com.sc.clinic.entity.OperationDate
import org.springframework.stereotype.Service

@Service
class OperationDateService {
    fun save(companyId: Long, operationDateDto: OperationDateDto ): OperationDateDto {
        println(companyId)
        TODO()
    }

    fun getByDate(companyId: Long, dateString: String): List<OperationDate> {
        println(companyId)
        TODO("Not yet implemented")
    }

    fun delete(companyId: Long, operationDateId: Long): Boolean {
        println(companyId)
        TODO("Not yet implemented")
    }
}