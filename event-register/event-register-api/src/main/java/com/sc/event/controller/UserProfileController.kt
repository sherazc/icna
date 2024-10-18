package com.sc.event.controller

import com.sc.event.dto.FlagDto
import com.sc.event.dto.UserProfileDto
import com.sc.event.service.UserProfileService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/user-profile")
@RestController
class UserProfileController(private val userProfileService: UserProfileService) {

    @GetMapping("/{userProfileId}")
    fun getUserProfile(@PathVariable userProfileId: Long): ResponseEntity<UserProfileDto> {
        val userProfileOptional = userProfileService.getUserProfile(userProfileId)

        return if (userProfileOptional.isEmpty) ResponseEntity.notFound().build()
        else ResponseEntity.ok(userProfileOptional.get())
    }

    @GetMapping("/find")
    fun findUserProfile(
        @RequestParam(required = true, name = "eventId") eventId: Long,
        @RequestParam(required = true, name = "userEmail") userEmail: String): ResponseEntity<UserProfileDto> {

        val userProfileOptional = userProfileService.findByEventIdAndUserEmailNoPassword(eventId, userEmail)

        return if (userProfileOptional.isEmpty) ResponseEntity.notFound().build()
        else ResponseEntity.ok(userProfileOptional.get())
    }

    @GetMapping("/email/exists")
    fun isEmailAlreadyExist(
        @RequestParam(required = true, name = "eventId") eventId: Long,
        @RequestParam(required = true, name = "userEmail") userEmail: String): ResponseEntity<FlagDto> {

        val emailAlreadyExists: Boolean = userProfileService.findByEventIdAndUserEmailNoPassword(eventId, userEmail)
            .map { up -> userEmail.equals(up.email, true)}
            .orElse(false)

        return ResponseEntity.ok(FlagDto(emailAlreadyExists))
    }
}