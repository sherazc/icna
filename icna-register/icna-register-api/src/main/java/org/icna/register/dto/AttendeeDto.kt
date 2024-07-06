package org.icna.register.dto

data class AttendeeDto(
    val id: Long,
    val registrationId: Long,
    val eventId: Long,
    val eventName: String,
    val firstName: String,
    val lastName: String,
)