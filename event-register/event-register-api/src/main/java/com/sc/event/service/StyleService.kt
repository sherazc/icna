package com.sc.event.service

import com.sc.event.entity.event.Event
import com.sc.event.mapper.StyleMapper
import com.sc.event.repository.EventStyleRepository
import com.sc.event.service.model.StyleVariable
import com.sc.event.service.model.getDefaultEntityStyleVariables
import org.springframework.stereotype.Service

@Service
class StyleService(
    private val eventStyleRepository: EventStyleRepository,
    private val styleMapper: StyleMapper) {
    fun getDefaultVariables(): List<StyleVariable> = getDefaultEntityStyleVariables()

    fun findVarByEventId(eventId: Long): List<StyleVariable> {
        // TODO move getDefaultEntityStyleVariables() in spring component.
        //   Because to mock top level function are mocked using io.mockk:mockk
        val defaultStyleVariables = getDefaultEntityStyleVariables()

        val overrideStyleVariables = eventStyleRepository.findVarByEventId(eventId)

        // merges both lists
        return defaultStyleVariables.map { default ->
            overrideStyleVariables.find { override ->
                default.styleName == override.styleName // if override has the same name return override else default
            } ?: default
        }
    }

    fun findCustomVarByEventId(eventId: Long): List<StyleVariable> = eventStyleRepository.findVarByEventId(eventId)

    fun save(savedEvent: Event, styleVariables: List<StyleVariable>): List<StyleVariable> =
        styleVariables.map { styleMapper.dtoToBean(it) }
            .map { it.apply { event = savedEvent } }
            .map { eventStyleRepository.save(it) }
            .map { styleMapper.beanToDto(it) }
}