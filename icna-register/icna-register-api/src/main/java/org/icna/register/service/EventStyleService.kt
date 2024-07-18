package org.icna.register.service

import org.icna.register.repository.EventStyleRepository
import org.icna.register.service.model.EventStyleVariable
import org.springframework.stereotype.Service

@Service
class EventStyleService(private val eventStyleRepository: EventStyleRepository) {
    fun findVarByEventId(eventId: Long) :List<EventStyleVariable>{

         TODO merge db and default and return
        eventStyleRepository.findVarByEventId(eventId)
        return emptyList()
    }
}