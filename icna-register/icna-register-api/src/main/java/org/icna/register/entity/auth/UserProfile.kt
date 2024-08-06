package org.icna.register.entity.auth

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import org.icna.register.entity.event.Event
import org.icna.register.entity.event.EventProgram
import org.icna.register.entity.event.Registration

@Entity
data class UserProfile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,
    @ManyToOne
    @JoinColumn(name = "event_id")
    var event: Event,
    @ManyToOne
    @JoinColumn(name = "registration_id")
    var registration: Registration?,
    @Column(nullable = false)
    var email: String,
    @Column(nullable = true)
    var userPassword: String
)  {
    @ManyToMany
    @JoinTable(
        name = "M2M_USER_PROFILE_USER_ROLE",
        joinColumns = [JoinColumn(name = "USER_PROFILE_ID")],
        inverseJoinColumns = [JoinColumn(name = "USER_ROLE_ID")])
    var eventPrograms: MutableSet<UserRole>? = mutableSetOf()
}