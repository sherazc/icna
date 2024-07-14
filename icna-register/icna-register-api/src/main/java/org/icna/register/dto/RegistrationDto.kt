package org.icna.register.dto

data class RegistrationDto(
    var id: Long?,
    val attendees: List<AttendeeDto>,
)