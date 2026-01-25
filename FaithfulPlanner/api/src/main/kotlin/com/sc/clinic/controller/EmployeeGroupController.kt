package com.sc.clinic.controller

import com.sc.clinic.dto.RegistrationDto
import com.sc.clinic.service.EmployeeGroupService
import com.sc.clinic.service.RegistrationSaveService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/employee-group")
@RestController
class EmployeeGroupController(
    private val employeeGroupService: EmployeeGroupService) {

    @GetMapping("/company/{companyId}/count")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun countGroups(@PathVariable companyId: Long) = employeeGroupService.countGroups(companyId)
}