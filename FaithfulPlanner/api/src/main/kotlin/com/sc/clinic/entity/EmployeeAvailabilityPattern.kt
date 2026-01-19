package com.sc.clinic.entity

import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
@Table(name = "employee_availability_pattern")
data class EmployeeAvailabilityPattern(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "employee_id", nullable = false)
    var employeeId: Long,

    @Enumerated(EnumType.STRING)
    @Column(name = "availability_pattern", nullable = false)
    var availabilityPattern: AvailabilityPattern,

    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true,

    @Column(name = "start_date")
    var startDate: LocalDate?,

    @Column(name = "end_date")
    var endDate: LocalDate?,

    @Column(name = "notes")
    var notes: String?,

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime = LocalDateTime.now()
)

