package com.sc.event.controller

import com.sc.event.dto.EventProgramDto
import com.sc.event.service.EventProgramService
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
        ResponseEntity.ok(eventProgramService.findDtoEventDtoById(eventId))
}
