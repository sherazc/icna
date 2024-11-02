package com.sc.event.controller

import com.sc.event.service.StyleService
import com.sc.event.service.model.StyleVariable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/styles/")
@RestController
class StyleController(private val styleService: StyleService) {

    @GetMapping("/variables/default")
    fun getDefaultVariables(): ResponseEntity<List<StyleVariable>> =
        ResponseEntity.ok(styleService.getDefaultVariables())

    /**
     * Merges both default and customized variables
     */
    @GetMapping("/variables/eventId/{eventId}")
    fun findStyleVariablesByEventId(@PathVariable eventId: Long): ResponseEntity<List<StyleVariable>> =
        ResponseEntity.ok(styleService.findVarByEventId(eventId))

    /**
     * Gets only customized variables
     */
    @GetMapping("/variables/custom/eventId/{eventId}")
    fun findCustomStyleVariablesByEventId(@PathVariable eventId: Long): ResponseEntity<List<StyleVariable>> =
        ResponseEntity.ok(styleService.findCustomVarByEventId(eventId))
}