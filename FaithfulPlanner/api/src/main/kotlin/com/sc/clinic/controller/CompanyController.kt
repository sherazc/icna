package com.sc.clinic.controller

import com.sc.clinic.CompanyService
import com.sc.clinic.dto.CompanyDto
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/company")
class CompanyController(private val companyService: CompanyService) {

    @GetMapping
    fun getAllCompanies() = companyService.getAllActive()


    @PutMapping
    @PreAuthorize(
        """
        hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN) 
        or 
        hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ASSISTANT) """)
    fun saveCompany(@RequestBody company: CompanyDto) = CompanyDto(companyService.saveCompany(company))
}