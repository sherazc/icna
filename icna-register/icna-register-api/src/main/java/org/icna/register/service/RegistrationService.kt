package org.icna.register.service

import org.icna.register.dto.AttendeeDto
import org.icna.register.dto.RegistrationDto
import org.icna.register.entity.auth.UserProfile
import org.icna.register.entity.event.Attendee
import org.icna.register.entity.event.Event
import org.icna.register.entity.event.EventProgram
import org.icna.register.entity.event.Registration
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

        // Save registration
        val registration: Registration
        val event: Event = eventService.getEventById(eventId)
        registration = if (registrationDto.id != null && registrationDto.id!! < 0) {
            val userProfileNew = UserProfile(null, event, registrationDto.userProfile.email, registrationDto.userProfile.userPassword)
            val registrationNew = Registration(null, event, userProfileNew)

            registrationRepository.save(registrationNew)
        } else {
            getById(registrationDto.id!!)
        }

        // Save Attendee
        val savedAttendees = registrationDto.attendees.map { saveAttendee(registration, it) }


        // Build Response
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