package org.icna.register.service

import org.icna.register.dto.EventDto
import org.icna.register.mapper.EventMapper
import org.icna.register.repository.EventRepository
import org.springframework.stereotype.Service
import java.util.Optional

@Service
class EventService(
    private val eventRepository: EventRepository,
    private val eventMapper: EventMapper) {
    fun findEventById(eventId: Long): Optional<EventDto> {
        val eventOptional = eventRepository.findById(eventId)
        return eventOptional.map { eventMapper.beanToDto(it) }
    }
}