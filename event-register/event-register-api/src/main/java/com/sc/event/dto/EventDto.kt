package com.sc.event.dto

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.sc.event.mapper.LocalDateTimeDeserializer
import java.time.LocalDateTime

data class EventDto(
    val id: Long?,
    val eventName: String,
    @JsonDeserialize(using = LocalDateTimeDeserializer::class)
    var startDate: LocalDateTime,
    @JsonDeserialize(using = LocalDateTimeDeserializer::class)
    var endDate: LocalDateTime?,
    var active: Boolean
)