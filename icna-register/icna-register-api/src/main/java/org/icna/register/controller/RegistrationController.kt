package org.icna.register.controller

import org.icna.register.dto.AttendeeDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/register")
@RestController
class RegistrationController {
//
//    @PutMapping("/eventId/{eventId}")
//    fun findAttendeeByEventId(@PathVariable eventId: Long): ResponseEntity<List<AttendeeDto>> =
//        ResponseEntity.ok(attendeeService.findAttendeeByEventId(eventId))
}