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

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "m2m_worker_worker_type",
        joinColumns = [JoinColumn(name = "worker_id")],
        inverseJoinColumns = [JoinColumn(name = "worker_type_id")]
    )
    var workerTypes: MutableSet<WorkerType> = mutableSetOf()
)

