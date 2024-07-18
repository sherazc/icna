package org.icna.register.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne


@Entity
data class EventStyle(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne()
    @JoinColumn(name = "EVENT_ID", nullable = false)
    var event: Event,
    var type: EventStyleType,
    var name: String,
    var value: String
)
