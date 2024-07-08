package org.icna.register.controller

import org.icna.register.dto.EventDto
import org.icna.register.dto.EventProgramDto
import org.icna.register.entity.EventProgram
import org.icna.register.service.EventProgramService
import org.icna.register.service.EventService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/programs/")
@RestController
class EventProgramController(private val eventProgramService: EventProgramService) {
    @GetMapping("/eventId/{eventId}")
    fun findProgramsByEventId(@PathVariable eventId: Long): ResponseEntity<List<EventProgramDto>> =
        ResponseEntity.ok(eventProgramService.findEventById(eventId))

    @GetMapping("/eventId2/{eventId}")
    fun findProgramsByEventId2(@PathVariable eventId: Long): ResponseEntity<List<EventProgram>> =
        ResponseEntity.ok(eventProgramService.test(eventId))
}
