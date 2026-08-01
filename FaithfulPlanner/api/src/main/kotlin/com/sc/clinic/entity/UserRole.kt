package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "user_role")
class UserRole(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "role_name", nullable = false)
    var roleName: String
)

