package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeGroupTypesDto
import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.entity.EmployeeGroup
import com.sc.clinic.entity.EmployeeType
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

    fun save(companyId: Long, employeeGroupsTypes: List<EmployeeGroupTypesDto>): List<EmployeeGroupTypesDto> {
        val existingGroupsTypes = getGroupsTypes(companyId)

        // Delete types
        existingGroupsTypes.forEach { gts ->
            gts.employeeTypes.forEach { t ->
                deleteTypeIfNotExists(gts.id, t.id, employeeGroupsTypes)
            }
        }

        // Delete groups
        existingGroupsTypes.forEach { gts ->
            val noneExists = employeeGroupsTypes.none { gtDto -> gts.id?.equals(gtDto.id) == true }
            if (noneExists) gts.id?.let { id -> employeeGroupRepository.deleteById(id)}
        }

        // Save Groups & Types
        val savedEmployeeGroups = employeeGroupsTypes.map { egDto ->
            val group: EmployeeGroup = getOrCreateGroupEntity(egDto)
            employeeGroupRepository.save(group)
            val employeeTypes: List<EmployeeType> = employeeTypeService.updateGroupTypes(group, egDto.employeeTypes)
            EmployeeGroupTypesDto(group, employeeTypes)
        }

        return savedEmployeeGroups
    }

    private fun getOrCreateGroupEntity(egDto: EmployeeGroupTypesDto): EmployeeGroup {
        egDto.id?.let { id -> if (id < 0) egDto.id = null }
        TODO("Not yet implemented")
    }

    private fun deleteTypeIfNotExists(
        existingGroupId: Long?, existingTypeId: Long?,
        newEmployeeGroupsTypes: List<EmployeeGroupTypesDto>
    ) {

        val groupAndTypeFound = newEmployeeGroupsTypes.any { gts ->
            gts.employeeTypes.any { ts -> gts.id?.equals(existingGroupId) == true && ts.id?.equals(existingTypeId) == true }
        }

        if (!groupAndTypeFound) {
            employeeTypeService.deleteType(existingTypeId)
        }
    }
}