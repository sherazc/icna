package org.icna.register.dto

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import org.icna.register.entity.EventStyleType


data class EventStyleDto(
    var id: Long?,
    var eventId: Long,
    var type: EventStyleType,
    var name: String,
    var value: String
)
