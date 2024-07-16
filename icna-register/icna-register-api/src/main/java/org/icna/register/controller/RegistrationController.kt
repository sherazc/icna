package org.icna.register.controller

import org.icna.register.dto.RegistrationDto
import org.icna.register.service.RegistrationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/registrations")
@RestController
class RegistrationController(private val registrationService: RegistrationService) {

    @PostMapping("/eventId/{eventId}")
    fun findAttendeeByEventId(
        @PathVariable eventId: Long,
        @RequestBody registration: RegistrationDto): ResponseEntity<RegistrationDto> =
        ResponseEntity.ok(registrationService.save(eventId, registration))
}