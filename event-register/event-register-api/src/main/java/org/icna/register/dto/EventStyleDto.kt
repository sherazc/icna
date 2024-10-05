package org.event.register.dto

import org.event.register.entity.ui.StyleType


data class EventStyleDto(
    var id: Long?,
    var eventId: Long,
    var type: StyleType,
    var styleName: String,
    var styleValue: String
)
