package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "employee_type")
data class EmployeeType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "type_name", nullable = false)
    var typeName: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type_group", nullable = false)
    var employeeTypeGroup: EmployeeTypeGroup
)

