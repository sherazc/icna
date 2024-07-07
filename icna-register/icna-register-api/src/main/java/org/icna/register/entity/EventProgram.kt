package org.icna.register.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
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
    val id: Long?,
    @ManyToOne
    @JoinColumn(name = "EVENT_ID", nullable = false)
    val event: Event,
    @ManyToMany(mappedBy = "eventPrograms")
    val attendees: Set<Attendee>?,
    @Column(nullable = false)
    val programName: String,
)