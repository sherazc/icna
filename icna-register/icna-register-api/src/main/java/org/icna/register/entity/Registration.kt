package org.icna.register.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne

/**
 * Defines relation between Event and group of Attendee.
 */
@Entity
data class Registration(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    @ManyToOne
    @JoinColumn(name = "EVENT_ID")
    val event: Event?
)