package com.sc.clinic.entity

import jakarta.persistence.*
import java.time.LocalTime
import java.time.LocalDateTime

@Entity
@Table(name = "clinic_schedule_employee")
data class ClinicScheduleEmployee(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "clinic_operation_date_id", nullable = false)
    var clinicOperationDateId: Long,

    @Column(name = "employee_id", nullable = false)
    var employeeId: Long,

    @Column(name = "assignment_status", nullable = false)
    var assignmentStatus: String = "ASSIGNED",

    @Column(name = "start_time")
    var startTime: LocalTime?,

    @Column(name = "end_time")
    var endTime: LocalTime?,

    @Column(name = "notes")
    var notes: String?,

    @Column(name = "assigned_by")
    var assignedBy: Long?,

    @Column(name = "assigned_at", nullable = false)
    var assignedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "confirmed_at")
    var confirmedAt: LocalDateTime?
)

