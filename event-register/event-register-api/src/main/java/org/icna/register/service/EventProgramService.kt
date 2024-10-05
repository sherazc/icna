package org.event.register.service

import org.event.register.dto.EventProgramDto
import org.event.register.repository.EventProgramRepository
import org.springframework.stereotype.Service

@Service
class EventProgramService(private val eventProgramRepository: EventProgramRepository) {
    fun findDtoEventDtoById(eventId: Long): List<EventProgramDto> = eventProgramRepository.findByEventId(eventId)
}