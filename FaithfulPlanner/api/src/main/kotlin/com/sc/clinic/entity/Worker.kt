package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "worker")
data class Worker(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "first_name", nullable = false)
    var firstName: String,

    @Column(name = "last_name", nullable = false)
    var lastName: String,

    @Column(name = "email")
    var email: String?,

    @Column(name = "phone_number")
    var phoneNumber: String?,

    @Column(name = "company_id")
    var companyId: Long?,

    @Column(name = "worker_type_id")
    var workerTypeId: Long?
)

