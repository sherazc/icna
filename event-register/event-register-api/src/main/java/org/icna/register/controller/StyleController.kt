package org.event.register.controller

import org.event.register.service.StyleService
import org.event.register.service.model.StyleVariable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/styles/")
@RestController
class StyleController(private val styleService: StyleService) {
    @GetMapping("/variables/eventId/{eventId}")
    fun findStyleVariablesByEventId(@PathVariable eventId: Long): ResponseEntity<List<StyleVariable>> =
        ResponseEntity.ok(styleService.findVarByEventId(eventId))
}