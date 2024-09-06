package org.icna.register.controller

import org.icna.register.dto.UserProfileDto
import org.icna.register.service.RegistrationService
import org.icna.register.service.UserProfileService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/user-profile")
@RestController
class UserProfileController(private val userProfileService: UserProfileService) {

    @GetMapping("/find")
    fun findUserProfile(
        @RequestParam(required = true, name = "eventId") eventId: Long,
        @RequestParam(required = true, name = "userEmail") userEmail: String): ResponseEntity<UserProfileDto> {

        val userProfileOptional = userProfileService.findByEventIdAndUserEmailNoPassword(eventId, userEmail)

        return if (userProfileOptional.isEmpty) ResponseEntity.notFound().build()
        else ResponseEntity.ok(userProfileOptional.get())
    }
}