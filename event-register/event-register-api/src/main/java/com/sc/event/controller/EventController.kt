package com.sc.event.controller

import com.sc.event.dto.EventDto
import com.sc.event.dto.EventFormDto
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

    @PostMapping("/id/{eventId}")
    fun saveEvent(
        @PathVariable eventId: Long,
        @RequestBody eventFormDto: EventFormDto): ResponseEntity<EventFormDto>  {

        val savedForm = if (eventId > 0) saveModify(eventId, eventFormDto)
        else saveNew(eventFormDto)

        return ResponseEntity.ok(savedForm)
    }

    @PreAuthorize("hasAuthority(T(com.sc.event.service.model.AuthRole).ADMIN)")
    private fun saveModify(eventId: Long, eventFormDto: EventFormDto): EventFormDto =
        eventSaveService.saveModify(eventId, eventFormDto)

    @PreAuthorize("permitAll()")
    private fun saveNew(eventFormDto: EventFormDto): EventFormDto = eventSaveService.saveNew(eventFormDto)
}
