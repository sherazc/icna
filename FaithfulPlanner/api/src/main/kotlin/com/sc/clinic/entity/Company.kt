package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "company")
data class Company(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "company_name", nullable = false)
    var companyName: String,

    @Column(name = "active")
    var active: Boolean?
)

