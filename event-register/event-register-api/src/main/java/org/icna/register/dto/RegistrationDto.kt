package org.event.register.dto

data class RegistrationDto(
    var id: Long?,
    var attendees: List<AttendeeDto>?,
    var userProfile: UserProfileDto
)