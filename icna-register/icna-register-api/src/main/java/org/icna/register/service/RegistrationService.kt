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

    fun save(eventId: Long, registrationDto: RegistrationDto): RegistrationDto {

        val registration: Registration
        val event: Event = eventService.getEventById(eventId)
        if (registrationDto.id != null && registrationDto.id!! < 0) {
            registration = registrationRepository.save(Registration(null, event))
        } else {
            registration = getById(registrationDto.id!!)
        }

        val savedAttendees = registrationDto.attendees.map { saveAttendee(registration, it) }

        registrationDto.id = registration.id
        registrationDto.attendees = savedAttendees.map {
            val eventProgramDtoList = it.eventPrograms?.map {
                val eventProgramDto = eventProgramMapper.beanToDto(it)
                eventProgramDto.eventId = eventId
                eventProgramDto
            }
            AttendeeDto(it.id!!, registration.id!!, eventId, event.eventName, it.firstName, it.lastName, eventProgramDtoList)
        }

        return registrationDto
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