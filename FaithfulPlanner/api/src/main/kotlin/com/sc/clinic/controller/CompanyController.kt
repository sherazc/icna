package com.sc.clinic.controller

import com.sc.clinic.CompanyService
import com.sc.clinic.dto.CompanyDto
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
    fun saveCompany(@RequestBody company: CompanyDto) = companyService.saveCompany(company)

}