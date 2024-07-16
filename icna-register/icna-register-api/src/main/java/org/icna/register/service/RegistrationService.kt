package org.icna.register.service

import jakarta.transaction.Transactional
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
                          private val attendeeService: AttendeeService,
                          private val eventProgramService: EventProgramService) {

    fun save(eventId: Long, registrationDto: RegistrationDto) {

        val registration: Registration
        if (registrationDto.id != null && registrationDto.id!! < 0) {
            val event: Event = eventService.getEventById(eventId)
            registration = Registration(null, event)
        } else {
            registration = getById(registrationDto.id!!)
        }

        registrationDto.attendees.forEach {
            val attendee = saveAttendee(registration, it)
            saveEventProgram(registration, it, attendee)

        }

    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    fun saveEventProgram(registration: Registration, attendeeDto: AttendeeDto, attendee: Attendee) {
        attendee.eventPrograms = attendeeDto.eventPrograms?.map {
            val eventProgramOptional = eventProgramService.findByIdAndAttendeeId(it.id, attendeeDto.id)
            val eventProgram: EventProgram
            if (eventProgramOptional.isPresent) {
                eventProgram = eventProgramOptional.get()
            } else {
                eventProgram = eventProgramMapper.dtoToBean(it)
                eventProgram.event = registration.event
            }
            eventProgram
        }?.toMutableSet() ?: emptySet()

        attendeeService.save(attendee)
    }


    @Transactional(Transactional.TxType.REQUIRES_NEW)
    fun saveAttendee(registration: Registration, attendeeDto: AttendeeDto): Attendee {
        val attendee = attendeeMapper.dtoToBean(attendeeDto)
        attendee.registration = registration
        return attendeeService.save(attendee)
    }

    fun getById(registrationId: Long): Registration = registrationRepository.findById(registrationId).orElseThrow {
        ResponseStatusException(
            HttpStatus.NOT_FOUND, "Registration $registrationId not found")
    }
}