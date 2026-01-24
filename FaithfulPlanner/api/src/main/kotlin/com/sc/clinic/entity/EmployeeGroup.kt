package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "employee_group")
data class EmployeeGroup(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "group_name", nullable = false)
    var groupName: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    var company: Company
)

