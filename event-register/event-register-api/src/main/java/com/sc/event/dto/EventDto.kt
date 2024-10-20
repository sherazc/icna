package com.sc.event.dto

import java.time.LocalDateTime

data class EventDto(
    val id: Long?,
    val eventName: String,
    var startDate: LocalDateTime,
    var endDate: LocalDateTime?,
    var active: Boolean
)