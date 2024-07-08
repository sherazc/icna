package org.icna.register.service

import org.icna.register.dto.EventProgramDto
import org.icna.register.entity.EventProgram
import org.icna.register.repository.EventProgramRepository
import org.springframework.stereotype.Service

@Service
class EventProgramService(private val eventProgramRepository: EventProgramRepository) {
    fun findEventById(eventId: Long): List<EventProgramDto> = eventProgramRepository.findByEventIda(eventId)


    fun test(eventId: Long): List<EventProgram> {
        val events = eventProgramRepository.findEventProgramByEvent_Id(eventId)
        println(events)
        return events
    }
}