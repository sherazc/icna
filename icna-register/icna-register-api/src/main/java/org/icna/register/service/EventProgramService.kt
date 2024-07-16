package org.icna.register.service

import org.icna.register.dto.EventProgramDto
import org.icna.register.repository.EventProgramRepository
import org.springframework.stereotype.Service

@Service
class EventProgramService(private val eventProgramRepository: EventProgramRepository) {
    fun findDtoEventDtoById(eventId: Long): List<EventProgramDto> = eventProgramRepository.findByEventId(eventId)
}