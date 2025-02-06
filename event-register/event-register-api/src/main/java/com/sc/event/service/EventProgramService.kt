package com.sc.event.service

import com.sc.event.dto.EventProgramDto
import com.sc.event.entity.event.Event
import com.sc.event.mapper.EventProgramMapper
import com.sc.event.repository.EventProgramRepository
import org.springframework.stereotype.Service

@Service
class EventProgramService(
    private val eventProgramRepository: EventProgramRepository,
    private val eventProgramMapper: EventProgramMapper) {
    fun findDtoEventDtoById(eventId: Long): List<EventProgramDto> = eventProgramRepository.findByEventId(eventId)

    fun save(eventEntity: Event, programDtoList: List<EventProgramDto>): List<EventProgramDto> {
        // Compose EventPrograms
        val eventPrograms = programDtoList
            .map { eventProgramMapper.dtoToBean(it) }
            .map { it.apply { if (id != null && id!! < 1) id = null } } // because negative id mean new entity
            .map { it.apply { event = eventEntity } } // create relation with event

        // Persists
        return eventPrograms
            .map { eventProgramRepository.save(it) }
            .map { eventProgramMapper.beanToDto(it) }
    }
}