package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "team_employee_type")
data class TeamEmployeeType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    var team: Team,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_type_id", nullable = false)
    var employeeType: EmployeeType,

    @Column(name = "required_count", nullable = false)
    var requiredCount: Int
)
