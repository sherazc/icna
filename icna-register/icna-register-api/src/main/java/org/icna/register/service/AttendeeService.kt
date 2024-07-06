package org.icna.register.service

import org.icna.register.dto.AttendeeDto
import org.icna.register.repository.AttendeeRepository
import org.springframework.stereotype.Service

@Service
class AttendeeService(private val attendeeRepository: AttendeeRepository) {
    fun findAttendeeByEventId(eventId: Long): List<AttendeeDto> = attendeeRepository.findAttendeeByEventId(eventId)
}