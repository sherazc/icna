package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeGroupDto
import com.sc.clinic.repository.EmployeeGroupRepository
import com.sc.clinic.repository.EmployeeTypeRepository
import org.springframework.stereotype.Service

@Service
class EmployeeGroupService(
    val employeeGroupRepository: EmployeeGroupRepository, val employeeTypeService: EmployeeTypeService
) {
    fun countGroups(companyId: Long) = employeeGroupRepository.countByCompanyId(companyId)

    fun getGroups(companyId: Long) =
        employeeGroupRepository.findByCompanyId(companyId)
            .map { group ->
                EmployeeGroupDto(
                    group.id, group.groupName,
                    group.id?.let { employeeTypeService.findDtoByEmployeeGroupId(it) } ?: emptyList()
                )
            }
}