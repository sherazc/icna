package com.sc.event.entity.event

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.LocalDateTime

@Entity
data class Event(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @Column(nullable = false)
    var eventName: String,
    var startDate: LocalDateTime,
    var endDate: LocalDateTime?,
    var active: Boolean
)