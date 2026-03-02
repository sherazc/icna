package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeGroupDto
import com.sc.clinic.dto.EmployeeGroupTypesDto
import com.sc.clinic.repository.EmployeeGroupRepository
import org.springframework.stereotype.Service

@Service
class EmployeeGroupService(
    val employeeGroupRepository: EmployeeGroupRepository,
    val employeeTypeService: EmployeeTypeService
) {
    fun countGroups(companyId: Long) = employeeGroupRepository.countByCompanyId(companyId)

    fun getGroupsTypes(companyId: Long) =
        employeeGroupRepository.findByCompanyId(companyId)
            .map { group ->
                EmployeeGroupTypesDto(
                    group.id, group.groupName,
                    group.id?.let { employeeTypeService.findDtoByEmployeeGroupId(it) } ?: emptyList()
                )
            }

    fun getGroups(companyId: Long) = employeeGroupRepository.findGroups(companyId)
    fun getGroup(groupId: Long) = employeeGroupRepository.findGroup(groupId)

    fun getGroupTypes(groupId: Long) = employeeGroupRepository.findGroup(groupId)?.let { group ->
        EmployeeGroupTypesDto(
            group.id, group.groupName,
            group.id?.let { employeeTypeService.findDtoByEmployeeGroupId(it) } ?: emptyList()
        )
    }

    fun save(companyId: Long, employeeGroupTypes: EmployeeGroupTypesDto): EmployeeGroupTypesDto {
        println(companyId)
        println(employeeGroupTypes)
        TODO("Not yet implemented")
    }

}