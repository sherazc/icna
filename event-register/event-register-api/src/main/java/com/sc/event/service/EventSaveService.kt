package com.sc.event.service

import com.sc.event.dto.EventFormDto
import com.sc.event.mapper.EventMapper
import com.sc.event.repository.EventRepository
import org.springframework.stereotype.Service

@Service
class EventSaveService(
    private val eventMapper: EventMapper,
    private val userProfileService: UserProfileService,
    private val eventRepository: EventRepository,
    private val eventProgramService: EventProgramService,
    private val styleService: StyleService) {


    fun saveModify(eventId: Long, eventFormDto: EventFormDto): EventFormDto {
        eventFormDto.event.id = eventId
        return save(eventFormDto)
    }


    fun save(eventFormDto: EventFormDto): EventFormDto {
        val event = eventMapper.dtoToBean(eventFormDto.event)
        val savedEvent = eventRepository.save(event)
        userProfileService.saveAdmin(savedEvent, eventFormDto.adminUserProfile)
        val savedEventProgramDtoList = eventProgramService.save(savedEvent, eventFormDto.programs)
        val savedStyleVariablesList = styleService.save(savedEvent, eventFormDto.styleVariables)


        println(eventFormDto)
        // TODO persist Event with the eventID
        return eventFormDto
    }

}