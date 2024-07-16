package org.icna.register.service

import org.icna.register.dto.AttendeeDto
import org.icna.register.dto.RegistrationDto
import org.icna.register.entity.Attendee
import org.icna.register.entity.Event
import org.icna.register.entity.EventProgram
import org.icna.register.entity.Registration
import org.icna.register.mapper.AttendeeMapper
import org.icna.register.mapper.EventProgramMapper
import org.icna.register.repository.RegistrationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class RegistrationService(private val eventService: EventService,
                          private val attendeeMapper: AttendeeMapper,
                          private val registrationRepository: RegistrationRepository,
                          private val eventProgramMapper: EventProgramMapper,
                          private val attendeeService: AttendeeService) {

    fun save(eventId: Long, registrationDto: RegistrationDto) {

        val registration: Registration
        if (registrationDto.id != null && registrationDto.id!! < 0) {
            val event: Event = eventService.getEventById(eventId)
            registration = Registration(null, event)
        } else {
            registration = getById(registrationDto.id!!)
        }

        registrationDto.attendees.forEach { saveAttendee(registration, it) }
    }

    fun saveAttendee(registration: Registration, attendeeDto: AttendeeDto): Attendee {
        val attendee = attendeeMapper.dtoToBean(attendeeDto)
        attendee.registration = registration
        attendee.eventPrograms = attendeeDto.eventPrograms?.map {
            val eventProgram: EventProgram = eventProgramMapper.dtoToBean(it)
            eventProgram.event = registration.event
            eventProgram
        }?.toMutableSet() ?: mutableSetOf()
        return attendeeService.save(attendee)
    }


    fun getById(registrationId: Long): Registration = registrationRepository.findById(registrationId).orElseThrow {
        ResponseStatusException(
            HttpStatus.NOT_FOUND, "Registration $registrationId not found")
    }
}