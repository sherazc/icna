package com.sc.event.service

import com.sc.event.dto.EventProgramDto
import com.sc.event.repository.EventProgramRepository
import org.springframework.stereotype.Service

@Service
class EventProgramService(private val eventProgramRepository: EventProgramRepository) {
    fun findDtoEventDtoById(eventId: Long): List<EventProgramDto> = eventProgramRepository.findByEventId(eventId)
}