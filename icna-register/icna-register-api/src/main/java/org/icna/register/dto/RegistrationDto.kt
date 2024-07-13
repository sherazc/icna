package org.icna.register.dto

data class RegistrationDto(
    val id: Long?,
    val attendees: List<AttendeeDto>,
)