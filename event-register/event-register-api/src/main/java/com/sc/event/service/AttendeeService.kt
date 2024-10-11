package com.sc.event.service

import com.sc.event.dto.AttendeeDto
import com.sc.event.entity.event.Attendee
import com.sc.event.entity.event.EventProgram
import com.sc.event.entity.event.Registration
import com.sc.event.mapper.AttendeeMapper
import com.sc.event.mapper.EventProgramMapper
import com.sc.event.repository.AttendeeRepository
import com.sc.event.repository.EventProgramRepository
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

    fun saveAttendees(registration: Registration, attendeeDtoList: List<AttendeeDto>?): List<Attendee> {
        return attendeeDtoList?.map { save(registration, it) } ?: ArrayList<Attendee>()
    }

    private fun save(registration: Registration, attendeeDto: AttendeeDto): Attendee {
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