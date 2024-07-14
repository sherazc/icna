package org.icna.register.service

import org.icna.register.dto.AttendeeDto
import org.icna.register.dto.RegistrationDto
import org.icna.register.entity.Attendee
import org.icna.register.entity.Event
import org.icna.register.entity.Registration
import org.icna.register.mapper.AttendeeMapper
import org.icna.register.repository.RegistrationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class RegistrationService(private val eventService: EventService,
                          private val attendeeMapper: AttendeeMapper,
                          private val registrationRepository: RegistrationRepository) {

    fun save(eventId: Long, registrationDto: RegistrationDto) {

        val registration:Registration
        if (registrationDto.id != null && registrationDto.id!! < 0) {
            val event: Event = eventService.getEventById(eventId)
            registration = Registration(null, event)
        } else {
            registration = getById(registrationDto.id!!)
        }

        val attendees = registrationDto.attendees.map { attendeeDeepMap(registration, it) }

        println(attendees)
    }


    private fun attendeeDeepMap(registration: Registration, attendeeDto: AttendeeDto): Attendee {
        val attendee = attendeeMapper.dtoToBean(attendeeDto)

        attendee.registration = registration

        println(attendee)
        return attendee
    }

    fun getById(registrationId: Long): Registration = registrationRepository.findById(registrationId).orElseThrow { ResponseStatusException(
        HttpStatus.NOT_FOUND, "Event $registrationId not found") }


}