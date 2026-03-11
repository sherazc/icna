package com.sc.clinic.entity

import jakarta.persistence.*
import java.time.LocalTime
import java.time.LocalDateTime

@Entity
@Table(name = "schedule")
data class Schedule(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operation_date_id", nullable = false)
    var operationDate: OperationDate,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    var userProfile: UserProfile,

    @Column(name = "notes")
    var notes: String?
)

