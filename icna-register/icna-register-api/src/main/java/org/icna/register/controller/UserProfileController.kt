package org.icna.register.controller

import org.icna.register.dto.RegistrationDto
import org.icna.register.dto.UserProfileDto
import org.icna.register.service.RegistrationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/user-profile")
@RestController
class UserProfileController(private val registrationService: RegistrationService) {

    @GetMapping("/find")
    fun findUserProfile(
        @RequestParam(required = true, name = "eventId") eventId: Long,
        @RequestParam(required = true, name = "userEmail") userEmail: String): ResponseEntity<List<UserProfileDto>> {

    }
}