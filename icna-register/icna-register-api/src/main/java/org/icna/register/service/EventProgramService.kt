package org.icna.register.service

import org.icna.register.dto.EventProgramDto
import org.icna.register.entity.EventProgram
import org.icna.register.repository.EventProgramRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class EventProgramService(private val eventProgramRepository: EventProgramRepository) {
    fun findDtoEventDtoById(eventId: Long): List<EventProgramDto> = eventProgramRepository.findByEventId(eventId)
    fun getById(eventProgramId: Long): EventProgram = eventProgramRepository.findById(eventProgramId).orElseThrow {
        ResponseStatusException(
            HttpStatus.NOT_FOUND, "EventProgram $eventProgramId not found")
    }

    fun findByIdAndAttendeeId(eventProgramId: Long, attendeeId: Long): Optional<EventProgram> =
        eventProgramRepository.findByIdAndAttendeeId(eventProgramId, attendeeId)
}