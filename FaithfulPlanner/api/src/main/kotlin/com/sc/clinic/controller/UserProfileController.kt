package com.sc.clinic.controller

import com.sc.clinic.service.UserProfileService
import com.sc.clinic.dto.CompanyDto
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/user-profile")
class UserProfileController (val userProfileService: UserProfileService){

    @GetMapping("/company-id/{companyId}")
    fun getAllUserProfiles(@PathVariable companyId: Long) = userProfileService.getAllActive(companyId)

//
//    @PutMapping
//    @PreAuthorize("""
//        hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)
//        or
//        hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ASSISTANT) """)
//    fun saveCompany(@RequestBody company: CompanyDto) = companyService.saveCompany(company)
}