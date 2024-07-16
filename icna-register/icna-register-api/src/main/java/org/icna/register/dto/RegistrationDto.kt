package org.icna.register.dto

data class RegistrationDto(
    var id: Long?,
    var attendees: List<AttendeeDto>,
)