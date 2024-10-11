package com.sc.event.dto

data class RegistrationDto(
    var id: Long?,
    var attendees: List<AttendeeDto>?,
    var userProfile: UserProfileDto
)