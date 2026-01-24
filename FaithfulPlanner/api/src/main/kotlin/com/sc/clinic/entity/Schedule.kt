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

    @Column(name = "operation_date_id", nullable = false)
    var operationDateId: Long,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_profile_id", nullable = false)
    var userProfile: UserProfile,

    @Column(name = "assignment_status", nullable = false)
    var assignmentStatus: String = "ASSIGNED",

    @Column(name = "start_time")
    var startTime: LocalTime?,

    @Column(name = "end_time")
    var endTime: LocalTime?,

    @Column(name = "notes")
    var notes: String?,

    @Column(name = "assigned_at", nullable = false)
    var assignedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "confirmed_at")
    var confirmedAt: LocalDateTime?
)

