package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "user_profile")
data class UserProfile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "email", nullable = false)
    var email: String,

    @Column(name = "user_password", length = 1024)
    val userPassword: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    val company: Company,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "m2m_user_profile_user_role",
        joinColumns = [JoinColumn(name = "user_profile_id")],
        inverseJoinColumns = [JoinColumn(name = "user_role_id")]
    )
    val roles: Set<UserRole> = emptySet()
)

