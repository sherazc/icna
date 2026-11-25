package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "schedule")
class Schedule(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_day_id", nullable = false)
    var operationDay: OperationDay,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    var userProfile: UserProfile,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    var team: Team?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_type_id")
    var employeeType: EmployeeType?,

    @Column(name = "team_instance_no")
    var teamInstanceNo: Int?
)

