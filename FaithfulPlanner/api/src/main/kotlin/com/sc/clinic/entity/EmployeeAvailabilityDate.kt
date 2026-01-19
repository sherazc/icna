package com.sc.clinic.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalTime
import java.time.LocalDateTime

@Entity
@Table(name = "employee_availability_date")
data class EmployeeAvailabilityDate(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "employee_id", nullable = false)
    var employeeId: Long,

    @Column(name = "availability_date", nullable = false)
    var availabilityDate: LocalDate,

    @Column(name = "is_available", nullable = false)
    var isAvailable: Boolean = true,

    @Column(name = "start_time")
    var startTime: LocalTime?,

    @Column(name = "end_time")
    var endTime: LocalTime?,

    @Column(name = "notes")
    var notes: String?,

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
)

