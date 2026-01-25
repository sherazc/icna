package com.sc.clinic.service

import com.sc.clinic.repository.EmployeeGroupRepository
import org.springframework.stereotype.Service

@Service
class EmployeeGroupService(
    private val employeeGroupRepository: EmployeeGroupRepository
) {
    fun countGroups(companyId: Long) = employeeGroupRepository.countByCompanyId(companyId)
}