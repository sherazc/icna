package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeGroupDto
import com.sc.clinic.dto.OpDayDetailDto
import com.sc.clinic.dto.OpDayDetailEmployeeGroupDto
import com.sc.clinic.dto.OpDayDetailUserProfileDto
import com.sc.clinic.repository.OperationDayRepository
import org.springframework.stereotype.Service

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
        companyId: Long,
        groups: List<EmployeeGroupDto>,
        opDayDetailEmployeeGroups: MutableList<OpDayDetailEmployeeGroupDto>
    ) {
        groups.forEach { g ->
            val oddGroup = OpDayDetailEmployeeGroupDto(g.id ?: 0, g.groupName)
            populateEmployee(companyId, oddGroup.id, oddGroup.users)
            opDayDetailEmployeeGroups.add(oddGroup)
        }
    }

    private fun populateEmployee(
        companyId: Long,
        groupId: Long,
        users: MutableList<OpDayDetailUserProfileDto>
    ) {
        userProfileService.findUserProfiles(companyId, groupId)
            .forEach { up ->
                val oddUser = OpDayDetailUserProfileDto(up.id ?: 0, )
            }
    }
}