package com.sc.clinic.controller

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.service.UserProfileService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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
    fun getUserProfileEmployeeTypes(@PathVariable companyId: Long, @PathVariable groupId: Long) =
        userProfileService.findUserProfiles(companyId, groupId)

    @GetMapping("/group/{groupId}/has-users")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun hasUserProfiles(@PathVariable companyId: Long, @PathVariable groupId: Long)
        = userProfileService.hasUserProfiles(companyId, groupId)

    @PostMapping("/group/{groupId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    fun saveUserProfileEmployeeTypes(
        @PathVariable companyId: Long,
        @PathVariable groupId: Long,
        @RequestBody userEmployeeTypes: UserProfileDto
    ): UserProfileDto =
        userProfileService.saveUserEmployee(companyId, userEmployeeTypes)
}