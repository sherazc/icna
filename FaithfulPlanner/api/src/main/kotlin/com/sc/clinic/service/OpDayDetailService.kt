package com.sc.clinic.service

import com.sc.clinic.dto.OpDayDetailDto
import com.sc.clinic.dto.OpDayDetailEmployeeGroupDto
import com.sc.clinic.repository.OperationDayRepository
import org.springframework.stereotype.Service

@Service
class OpDayDetailService(private val operationDayRepository: OperationDayRepository) {
    fun getAll(companyId: Long): List<OpDayDetailDto> {

        val operationDayDetails = operationDayRepository.getByCompanyId(companyId)
            .map { od ->
                val odd = OpDayDetailDto(od.id ?: 0, od.companyId, od.serviceDateString, od.notes)
                populateGroups(companyId, od.id ?: 0, odd.opDayDetailEmployeeGroups)
                odd
            }



        return operationDayDetails
    }

    private fun populateGroups(
        companyId: Long,
        operationDayId: Long,
        opDayDetailEmployeeGroups: List<OpDayDetailEmployeeGroupDto>
    ) {
    }
}