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

    @GetMapping("/manager/email/exists")
    fun isDuplicateEventManager(
        @RequestParam(required = true, name = "eventId") eventId: Long,
        @RequestParam(required = true, name = "userEmail") userEmail: String): ResponseEntity<Boolean> {

        /*
        Remove eventId check if (submitErrors.length < 1 && eventId) {
        from ManageEvent.tsx

        Make this method return Boolean like /email/exists returns. Instead of UserProfileDto

        change endpoint in ApiRegister from /find to /admin/email/exists

        if event id is sent then check if this returns a user profile
        val userProfileOptional = userProfileService.findByEventIdAndUserEmailNoPassword(eventId, userEmail)

        if event id is not sent
            get all user profiles with this email

            get the event id for that user profile

            check if



         */

        val userProfileOptional = userProfileService.findByEventIdAndUserEmailNoPassword(eventId, userEmail)

//        return if (userProfileOptional.isEmpty) ResponseEntity.notFound().build()
//        else ResponseEntity.ok(userProfileOptional.get())

        return ResponseEntity.ok(true)
    }

    @GetMapping("/email/exists")
    fun isEmailExist(
        @RequestParam(required = true, name = "eventId") eventId: Long,
        @RequestParam(required = true, name = "userEmail") userEmail: String): ResponseEntity<FlagDto> {

        val emailAlreadyExists: Boolean = userProfileService.findByEventIdAndUserEmailNoPassword(eventId, userEmail)
            .map { up -> userEmail.equals(up.email, true) }
            .orElse(false)

        return ResponseEntity.ok(FlagDto(emailAlreadyExists))
    }

    @GetMapping("/event/{eventId}/admin")
    fun findEventAdmin(@PathVariable eventId: Long): ResponseEntity<UserProfileDto> {
        val adminUser = userProfileService.findEventAdmin(eventId)
        return if (adminUser == null) ResponseEntity.notFound().build()
        else ResponseEntity.ok(adminUser)
    }
}