package org.icna.register.controller

import org.icna.register.dto.AttendeeDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/registrations")
@RestController
class RegistrationController {

    @PostMapping("/eventId/{eventId}")
    fun findAttendeeByEventId(@PathVariable eventId: Long): ResponseEntity<String> {

        return ResponseEntity.ok("Ok");
    }
}