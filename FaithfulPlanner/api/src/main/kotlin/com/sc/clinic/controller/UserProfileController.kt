package com.sc.clinic.controller

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.dto.UserProfileUserDetails
import com.sc.clinic.service.UserProfileService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/company/{companyId}/user-profile")
class UserProfileController(val userProfileService: UserProfileService) {

    @GetMapping
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getAllUserProfiles(@PathVariable companyId: Long) = userProfileService.getAllActive(companyId)

    @DeleteMapping("/{userProfileId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    fun deleteUser(@PathVariable companyId: Long, @PathVariable userProfileId: Long) =
        userProfileService.deleteUser(userProfileId)

    @GetMapping("/{userProfileId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getUser(@PathVariable companyId: Long, @PathVariable userProfileId: Long): ResponseEntity<UserProfileDto> =
        userProfileService.getUser(userProfileId) ?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()

    @GetMapping("/group/{groupId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun getUserProfileEmployeeTypes(@PathVariable companyId: Long, @PathVariable groupId: Long) =
        userProfileService.findUserProfiles(companyId, groupId)

    @GetMapping("/group/{groupId}/has-users")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun hasUserProfiles(@PathVariable companyId: Long, @PathVariable groupId: Long) =
        userProfileService.hasUserProfiles(companyId, groupId)

    @PostMapping
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    fun saveUserProfileEmployeeTypes(
        @PathVariable companyId: Long,
        @RequestBody userEmployeeTypes: UserProfileDto,
        @AuthenticationPrincipal jwt: Jwt,
        authentication: Authentication
    ): UserProfileDto {

//        val currentUser = authentication.principal as UserProfileUserDetails
//
//        val userId = currentUser.getUserProfileId()
//        val userEmail = currentUser.username  // This is the email
//        val userCompanyId = currentUser.getCompanyId()
//        val roles = authentication.authorities.map { it.authority }
        // Extract information from JWT claims
        val userEmail = jwt.subject
        val userCompanyId = jwt.getClaimAsString("companyId")?.toLong()
        val roles = authentication.authorities.map { it.authority }


        return userProfileService.saveUserEmployee(companyId, userEmployeeTypes)
    }


    @GetMapping("/group/{groupId}/operation-day/{operationId}")
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    fun findGroupScheduledUsers(
        @PathVariable companyId: Long,
        @PathVariable groupId: Long,
        @PathVariable operationId: Long,
        @RequestParam(name = "scheduled", required = true) scheduled: Boolean
    ) = userProfileService.findGroupScheduledUsers(companyId, groupId, operationId, scheduled)
}