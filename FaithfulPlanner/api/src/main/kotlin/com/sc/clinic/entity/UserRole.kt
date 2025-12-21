package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "user_role")
data class UserRole(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "role_name", nullable = false)
    val roleName: String
)

