package com.sc.event.service

import com.sc.event.dto.EventDto
import com.sc.event.entity.event.Event
import com.sc.event.mapper.EventMapper
import com.sc.event.repository.EventRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.Optional

@Service
class EventService(
    private val eventRepository: EventRepository,
    private val eventMapper: EventMapper) {
    fun findDtoById(eventId: Long): Optional<EventDto> {
        val eventOptional = eventRepository.findById(eventId)
        return eventOptional.map { eventMapper.beanToDto(it) }
    }

    fun getEventById(eventId: Long): Event = eventRepository.findById(eventId)
        .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Event $eventId not found") }

}