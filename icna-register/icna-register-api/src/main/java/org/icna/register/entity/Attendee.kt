package org.icna.register.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne

@Entity
data class Attendee(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne
    @JoinColumn(name = "registration_id")
    var registration: Registration?,
    @ManyToMany
    @JoinTable(
        name = "M2M_EVENT_PROGRAM_ATTENDEE",
        joinColumns = [JoinColumn(name = "ATTENDEE_ID")],
        inverseJoinColumns = [JoinColumn(name = "EVENT_PROGRAM_ID")])
    var eventPrograms: Set<EventProgram?>?,
    @Column(nullable = false)
    var firstName: String,
    @Column(nullable = false)
    var lastName: String,
)