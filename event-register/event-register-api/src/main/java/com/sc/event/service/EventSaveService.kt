package com.sc.event.service

import com.sc.event.dto.EventFormDto
import org.springframework.stereotype.Service

@Service
class EventSaveService {
    fun saveModify(eventId: Long, eventFormDto: EventFormDto): EventFormDto {
        println(eventFormDto)
        // TODO persist Event with the eventID
        return eventFormDto
    }


    fun saveNew(eventFormDto: EventFormDto): EventFormDto {
        println(eventFormDto)
        // TODO persist Event with the eventID
        return eventFormDto
    }
}