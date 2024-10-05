package org.event.register.service

import org.event.register.repository.EventStyleRepository
import org.event.register.service.model.StyleVariable
import org.event.register.service.model.getDefaultEntityStyleVariables
import org.springframework.stereotype.Service

@Service
class StyleService(private val eventStyleRepository: EventStyleRepository) {
    fun findVarByEventId(eventId: Long): List<StyleVariable> {
        // TODO move getDefaultEntityStyleVariables() in spring component.
        //   Because to mock top level function are mocked using io.mockk:mockk
        val defaultStyleVariables = getDefaultEntityStyleVariables()

        val overrideStyleVariables = eventStyleRepository.findVarByEventId(eventId)
            .map { StyleVariable(it.styleName, it.styleValue) }

        return defaultStyleVariables.map { default ->
            overrideStyleVariables.find { override ->
                default.styleName == override.styleName
            } ?: default
        }
    }
}