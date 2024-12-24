package com.sc.event.controller

import com.sc.event.dto.EventDto
import com.sc.event.dto.EventFormDto
import com.sc.event.dto.RegistrationDto
import com.sc.event.service.EventSaveService
import com.sc.event.service.EventService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/events")
@RestController
class EventController(private val eventService: EventService,
    private val eventSaveService: EventSaveService) {

    @PreAuthorize("permitAll()")
    @GetMapping("/future/active")
    fun getFutureActive(): ResponseEntity<List<EventDto>> = ResponseEntity.ok(eventService.futureActive())

    @PreAuthorize("permitAll()")
    @GetMapping("/id/{eventId}")
    fun getEvent(@PathVariable eventId: Long): ResponseEntity<EventDto> {
        val event = eventService.findDtoById(eventId)
        return if (event.isEmpty) ResponseEntity.notFound().build() else ResponseEntity.ok(event.get())
    }

    @PostMapping("/eventId/{eventId}")
    fun saveRegistration(
        @PathVariable eventId: Long,
        @RequestBody eventFormDto: EventFormDto): ResponseEntity<EventFormDto> =
        ResponseEntity.ok(eventSaveService.save(eventId, eventFormDto))


}
