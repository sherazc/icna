package com.sc.clinic.entity

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "operation_date")
data class OperationDay(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    var company: Company,

    @Column(name = "service_date", nullable = false)
    var serviceDate: LocalDate,

    @Column(name = "notes")
    var notes: String?
)