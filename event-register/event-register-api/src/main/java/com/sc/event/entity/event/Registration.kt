package com.sc.event.entity.event

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.OneToOne
import com.sc.event.entity.auth.UserProfile

/**
 * Defines relation between Event and group of Attendee.
 */
@Entity
data class Registration(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne
    @JoinColumn(name = "event_id")
    var event: Event,
    @OneToOne
    @JoinColumn(name = "user_profile_id")
    var userProfile: UserProfile,
)