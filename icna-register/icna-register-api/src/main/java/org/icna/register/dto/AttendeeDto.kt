package org.icna.register.dto

class AttendeeDto(
    val id: Long,
    val registrationId: Long,
    val eventId: Long,
    val eventName: String,
    val firstName: String,
    val lastName: String,
    var eventPrograms: List<EventProgramDto>?
)