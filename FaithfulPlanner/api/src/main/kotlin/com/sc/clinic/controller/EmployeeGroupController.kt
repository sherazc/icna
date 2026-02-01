package com.sc.clinic.controller

import com.sc.clinic.service.EmployeeGroupService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/company/{companyId}/employee-group")
@RestController
class EmployeeGroupController(
    private val employeeGroupService: EmployeeGroupService
) {
    @GetMapping("/{groupId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getGroup(@PathVariable companyId: Long, @PathVariable groupId: Long) = employeeGroupService.getGroup(groupId)

    @GetMapping("/{groupId}/types")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getGroupTypes(@PathVariable companyId: Long, @PathVariable groupId: Long) =
        employeeGroupService.getGroupTypes(groupId)

    @GetMapping
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getGroups(@PathVariable companyId: Long) = employeeGroupService.getGroups(companyId)

    @GetMapping("/types")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getGroupsTypes(@PathVariable companyId: Long) = employeeGroupService.getGroupsTypes(companyId)

    @GetMapping("/count")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun countGroups(@PathVariable companyId: Long) = employeeGroupService.countGroups(companyId)
}