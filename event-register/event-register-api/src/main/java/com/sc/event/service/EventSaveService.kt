package com.sc.event.service

import com.sc.event.dto.EventFormDto
import org.springframework.stereotype.Service

@Service
class EventSaveService {
    fun save(eventId: Long, eventFormDto: EventFormDto): EventFormDto {
        println(eventFormDto)
        return eventFormDto
    }
}