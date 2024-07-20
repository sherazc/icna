package org.icna.register.dto

import org.icna.register.entity.StyleType


data class EventStyleDto(
    var id: Long?,
    var eventId: Long,
    var type: StyleType,
    var styleName: String,
    var styleValue: String
)
