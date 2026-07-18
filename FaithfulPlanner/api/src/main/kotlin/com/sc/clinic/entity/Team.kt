package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "team")
data class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_day_id", nullable = false)
    var operationDay: OperationDay,

    @Column(name = "team_name", nullable = false)
    var teamName: String,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "m2m_team_employee_type",
        joinColumns = [JoinColumn(name = "team_id")],
        inverseJoinColumns = [JoinColumn(name = "employee_type_id")]
    )
    var employeeTypes: MutableSet<EmployeeType> = mutableSetOf()
)
