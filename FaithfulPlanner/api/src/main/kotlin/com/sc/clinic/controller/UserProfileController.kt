package com.sc.clinic.controller

import com.sc.clinic.service.UserProfileService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/company/{companyId}/user-profile")
class UserProfileController(val userProfileService: UserProfileService) {

    @GetMapping
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getAllUserProfiles(@PathVariable companyId: Long) = userProfileService.getAllActive(companyId)

    @GetMapping("/group/{groupId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getAllUserProfiles(@PathVariable companyId: Long, @PathVariable groupId: Long) =
        userProfileService.findByCompanyIdAndEmployeeGroupId(companyId, groupId)
}