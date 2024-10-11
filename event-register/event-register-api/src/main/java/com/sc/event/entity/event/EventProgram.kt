package com.sc.event.entity.event

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne

@Entity
data class EventProgram(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne()
    @JoinColumn(name = "event_id", nullable = false)
    var event: Event,
    @Column(nullable = false)
    var programName: String,
) {
    @ManyToMany(mappedBy = "eventPrograms")
    var attendees: MutableSet<Attendee>? = mutableSetOf()
}