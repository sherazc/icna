package org.icna.register.controller

import org.icna.register.dto.EventProgramDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/event-styles/")
@RestController
class EventStyleController {
    @GetMapping("/eventId/{eventId}")
    fun findProgramsByEventId(@PathVariable eventId: Long): ResponseEntity<List<EventProgramDto>> =
        ResponseEntity.ok(eventProgramService.findDtoEventDtoById(eventId))
}