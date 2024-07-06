package org.icna.register.controller

import org.icna.register.dto.AttendeeDto
import org.icna.register.service.AttendeeService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/attendees")
@RestController
class AttendeeController(private val attendeeService: AttendeeService) {

    @GetMapping("/eventId/{eventId}")
    fun findAttendeeByEventId(@PathVariable eventId: Long): ResponseEntity<List<AttendeeDto>> =
        ResponseEntity.ok(attendeeService.findAttendeeByEventId(eventId))

    @GetMapping("/eventId/{eventId}/registrationId/{registrationId}")
    fun findAttendeeByEventIdAndRegistrationId(@PathVariable eventId: Long,
                                               @PathVariable registrationId: Long): ResponseEntity<List<AttendeeDto>> =
        ResponseEntity.ok(attendeeService.findAttendeeByEventIdAndRegistrationId(eventId, registrationId))

    @GetMapping("/id/{attendeeId}")
    fun getAttendee(@PathVariable attendeeId: Long): ResponseEntity<AttendeeDto> {
        val attendeeDtoOptional = attendeeService.findAttendeeByAttendeeId(attendeeId)
        return if (attendeeDtoOptional.isEmpty) ResponseEntity.notFound().build() else ResponseEntity.ok(
            attendeeDtoOptional.get())
    }
}
