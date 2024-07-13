package org.icna.register.service

import org.icna.register.dto.RegistrationDto
import org.icna.register.entity.Event
import org.springframework.stereotype.Service

@Service
class RegistrationService(private val eventService: EventService) {
    fun save(eventId: Long, registration: RegistrationDto) {
        val event: Event = eventService.getEventById(eventId)

        println("Saving event $event")

        registration.attendees.map { }


    }


}