package org.icna.register.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne

@Entity
data class UserProfile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long?,
    @ManyToOne
    @JoinColumn(name = "event_id")
    val event: Event,
    @ManyToOne
    @JoinColumn(name = "registration_id")
    var registration: Registration?,
)  {
    @ManyToMany
    @JoinTable(
        name = "M2M_USER_PROFILE_USER_ROLE",
        joinColumns = [JoinColumn(name = "USER_PROFILE_ID")],
        inverseJoinColumns = [JoinColumn(name = "USER_ROLE_ID")])
    var eventPrograms: MutableSet<EventProgram>? = mutableSetOf()
}