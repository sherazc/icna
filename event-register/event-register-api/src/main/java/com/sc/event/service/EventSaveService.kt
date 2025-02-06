package com.sc.event.service

import com.sc.event.dto.EventFormDto
import com.sc.event.mapper.EventMapper
import com.sc.event.repository.EventRepository
import org.springframework.stereotype.Service

@Service
class EventSaveService(
    private val eventMapper: EventMapper,
    private val eventRepository: EventRepository,
    private val eventProgramService: EventProgramService,
    private val styleService: StyleService) {


    fun saveModify(eventId: Long, eventFormDto: EventFormDto): EventFormDto {
        println(eventFormDto)
        // TODO persist Event with the eventID
        return eventFormDto
    }


    fun saveNew(eventFormDto: EventFormDto): EventFormDto {
        val event = eventMapper.dtoToBean(eventFormDto.event)
        val savedEvent = eventRepository.save(event)
        val savedEventProgramDtoList = eventProgramService.save(savedEvent, eventFormDto.programs)
        val savedEventProgramDtoList = styleService.save(savedEvent, eventFormDto.styleVariables)


        println(eventFormDto)
        // TODO persist Event with the eventID
        return eventFormDto
    }

}