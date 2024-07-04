package org.icna.register.controller

import org.icna.register.dto.EventDto
import org.icna.register.service.EventService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/events")
@RestController
class EventController(private val eventService: EventService) {
    @GetMapping("/id/{eventId}")
    fun findById(@PathVariable eventId: Long): ResponseEntity<EventDto> {
        val event = eventService.findEventById(eventId)
        return if (event.isEmpty) ResponseEntity.notFound().build() else ResponseEntity.ok(event.get())
    }
}