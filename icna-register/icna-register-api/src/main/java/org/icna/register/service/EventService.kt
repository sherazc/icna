package org.icna.register.service

import org.icna.register.dto.EventDto
import org.icna.register.repository.EventRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class EventService(private val eventRepository: EventRepository) {
    fun findEventById(id: Long): Optional<EventDto> {
        return Optional.ofNullable(EventDto())
    }
}