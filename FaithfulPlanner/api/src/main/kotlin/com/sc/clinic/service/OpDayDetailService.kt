package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeGroupDto
import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.dto.OpDayDetailDto
import com.sc.clinic.dto.OpDayDetailEmployeeGroupDto
import com.sc.clinic.dto.OpDayDetailUserProfileDto
import com.sc.clinic.dto.OpDayEmployeeTypeDto
import com.sc.clinic.repository.OperationDayRepository
import com.sc.clinic.repository.OperationDaySpecification
import com.sc.clinic.util.DateUtils
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service

@Service
class OpDayDetailService(
    private val operationDayRepository: OperationDayRepository,
    private val employeeGroupService: EmployeeGroupService,
    private val userProfileService: UserProfileService
) {
    fun find(companyId: Long, before: String?, after: String?): List<OpDayDetailDto> {
        val beforeDate = DateUtils.isoToDate(before)
        val afterDate = DateUtils.isoToDate(after)
        val specification = Specification.where(OperationDaySpecification.ofCompany(companyId))
            .and(OperationDaySpecification.before(beforeDate))
            .and(OperationDaySpecification.after(afterDate))

        val g2 = operationDayRepository.findAll(specification)
        println(g2)

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