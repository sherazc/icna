package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "ref_employee_type")
data class RefEmployeeType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "type_name", nullable = false)
    var typeName: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_group_id", nullable = false)
    var employeeGroup: EmployeeGroup
)


