package com.sc.event.dto

import com.sc.event.service.model.StyleVariable

data class EventFormDto(
    var adminUserProfile: UserProfileDto,
    var event: EventDto,
    var programs: List<EventProgramDto>,
    var styleVariables: List<StyleVariable>
)
