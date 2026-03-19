package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeGroupDto
import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.dto.OpDayDetailDto
import com.sc.clinic.dto.OpDayDetailEmployeeGroupDto
import com.sc.clinic.dto.OpDayDetailUserProfileDto
import com.sc.clinic.dto.OpDayEmployeeTypeDto
import com.sc.clinic.repository.OperationDayRepository
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class OpDayDetailService(
    private val operationDayRepository: OperationDayRepository,
    private val employeeGroupService: EmployeeGroupService,
    private val userProfileService: UserProfileService
) {
    fun getAll(companyId: Long): List<OpDayDetailDto> {
        val groups = employeeGroupService.getGroupsDto(companyId);

        val operationDayDetails = operationDayRepository.getByCompanyId(companyId)
            .map { od ->
                val odd = OpDayDetailDto(od.id ?: 0, od.companyId, od.serviceDateString, od.notes)
                populateGroups(companyId, groups, odd.opDayDetailEmployeeGroups)
                odd
            }

        return operationDayDetails
    }

    private fun populateGroups(
        companyId: Long, groups: List<EmployeeGroupDto>,
        oddGroups: MutableList<OpDayDetailEmployeeGroupDto>
    ) {
        groups.forEach { g ->
            val oddGroup = OpDayDetailEmployeeGroupDto(g.id ?: 0, g.groupName)
            populateEmployee(companyId, oddGroup.id, oddGroup.users)
            oddGroups.add(oddGroup)
        }
    }

    private fun populateEmployee(companyId: Long, groupId: Long, oddUsers: MutableList<OpDayDetailUserProfileDto>) {
        userProfileService.findUserProfiles(companyId, groupId)
            .forEach { up ->
                val oddUser = OpDayDetailUserProfileDto(
                    up.id ?: 0,
                    up.email,
                    up.firstName ?: "",
                    up.lastName ?: "",
                    up.phoneNumber ?: ""
                )
                populateType(up.employeeTypesDto, oddUser.type)

                oddUsers.add(oddUser)
            }
    }

    private fun populateType(types: List<EmployeeTypeDto>, oddTypes: MutableList<OpDayEmployeeTypeDto>) {
        types.forEach { oddTypes.add(OpDayEmployeeTypeDto(it.id ?: 0, it.typeName)) }
    }
}