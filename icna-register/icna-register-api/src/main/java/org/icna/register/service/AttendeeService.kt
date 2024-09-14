package org.icna.register.service

import org.icna.register.dto.AttendeeDto
import org.icna.register.entity.event.Attendee
import org.icna.register.entity.event.EventProgram
import org.icna.register.entity.event.Registration
import org.icna.register.mapper.AttendeeMapper
import org.icna.register.mapper.EventProgramMapper
import org.icna.register.repository.AttendeeRepository
import org.icna.register.repository.EventProgramRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class AttendeeService(private val attendeeMapper: AttendeeMapper,
                      private val eventProgramMapper: EventProgramMapper,
                      private val attendeeRepository: AttendeeRepository,
                      private val eventProgramRepository: EventProgramRepository) {
    fun findAttendeeByEventId(eventId: Long): List<AttendeeDto> =
        attendeeRepository.findAttendeeByEventId(eventId)

    fun findAttendeeByAttendeeId(attendeeId: Long): Optional<AttendeeDto> {
        val attendeeOptional = attendeeRepository.findAttendeeByAttendeeId(attendeeId)
        if (attendeeOptional.isPresent) {
            attendeeOptional.get().eventPrograms = eventProgramRepository.findByAttendeeId(attendeeId)
        }
        return attendeeOptional
    }

    fun findAttendeeByEventIdAndRegistrationId(eventId: Long, registrationId: Long): List<AttendeeDto> {
        val attendees = attendeeRepository.findAttendeeByEventIdAndRegistrationId(eventId, registrationId)
        attendees.forEach { it.eventPrograms = eventProgramRepository.findByAttendeeId(it.id) }
        return attendees
    }

    fun save(registration: Registration, attendeeDto: AttendeeDto): Attendee {
        val attendee = attendeeMapper.dtoToBean(attendeeDto)
        if (attendee.id!! < 0 ) {
            attendee.id = null
        }
        attendee.registration = registration
        attendee.eventPrograms = attendeeDto.eventPrograms?.map {
            val eventProgram: EventProgram = eventProgramMapper.dtoToBean(it)
            eventProgram.event = registration.event
            eventProgram
        }?.toMutableSet() ?: mutableSetOf()
        return attendeeRepository.save(attendee)
    }

}