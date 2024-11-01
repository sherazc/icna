package com.sc.event.service

import com.sc.event.repository.EventStyleRepository
import com.sc.event.service.model.StyleVariable
import com.sc.event.service.model.getDefaultEntityStyleVariables
import org.springframework.stereotype.Service

@Service
class StyleService(private val eventStyleRepository: EventStyleRepository) {
    fun getDefaultVariables(): List<StyleVariable> = getDefaultEntityStyleVariables()

    fun findVarByEventId(eventId: Long): List<StyleVariable> {
        // TODO move getDefaultEntityStyleVariables() in spring component.
        //   Because to mock top level function are mocked using io.mockk:mockk
        val defaultStyleVariables = getDefaultEntityStyleVariables()

        val overrideStyleVariables = eventStyleRepository.findVarByEventId(eventId)
            .map { StyleVariable(it.styleName, it.styleValue, it.type) }

        return defaultStyleVariables.map { default ->
            overrideStyleVariables.find { override ->
                default.styleName == override.styleName
            } ?: default
        }
    }
}