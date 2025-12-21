package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "company")
data class Company(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "company_name", nullable = false)
    val companyName: String,

    @Column(name = "active")
    val active: Boolean? = null,

    @Column(name = "enable_monetization")
    val enableMonetization: Boolean? = null,

    @Column(name = "enable_group_registration")
    val enableGroupRegistration: Boolean? = null,

    @Column(name = "enable_start_end_date")
    val enableStartEndDate: Boolean? = null
)

