package org.icna.register.dto

/**
 * Person who is attending the event.
 * Person whose badge will be printed
 */
class AttendeeDto(
    val id: Long,
    val registrationId: Long,
    val eventId: Long,
    val firstName: String,
    val lastName: String,
    var eventPrograms: List<EventProgramDto>?
)