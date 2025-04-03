package com.sc.event.dto

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.sc.event.mapper.LocalDateTimeDeserializer
import java.time.LocalDateTime

data class EventDto(
    var id: Long?,
    var eventName: String,
    @JsonDeserialize(using = LocalDateTimeDeserializer::class)
    var startDate: LocalDateTime?,
    @JsonDeserialize(using = LocalDateTimeDeserializer::class)
    var endDate: LocalDateTime?,
    var active: Boolean,
    var enableMonetization: Boolean,
    var enableGroupRegistration: Boolean,
    var enableStartEndDate: Boolean,
)