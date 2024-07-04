package org.icna.register.service

import org.icna.register.dto.EventDto
import org.icna.register.mapper.EventMapper2
import org.icna.register.repository.EventRepository
import org.springframework.stereotype.Service
import java.util.Optional


@Service
class EventService(
    private val eventRepository: EventRepository,
    private val eventMapper: EventMapper2) {
    fun findEventById(eventId: Long): Optional<EventDto> {
        val eventOptional = eventRepository.findById(eventId)

        val eventDtoOptional = eventOptional.map { eventMapper.beanToDto(it) }

        println(eventDtoOptional)

        return Optional.ofNullable(EventDto(100, "Mock Event"))
    }
}