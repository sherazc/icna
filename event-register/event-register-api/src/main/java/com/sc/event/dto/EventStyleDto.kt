package com.sc.event.dto

import com.sc.event.entity.ui.StyleType


data class EventStyleDto(
    var id: Long?,
    var eventId: Long,
    var type: StyleType,
    var styleName: String,
    var styleValue: String
)
