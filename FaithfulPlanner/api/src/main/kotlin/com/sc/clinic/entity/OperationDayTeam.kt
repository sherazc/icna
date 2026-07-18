package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "operation_day_team")
data class OperationDayTeam(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_day_id", nullable = false)
    var operationDay: OperationDay,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    var team: Team,

    @Column(name = "required_count", nullable = false)
    var requiredCount: Int
)
