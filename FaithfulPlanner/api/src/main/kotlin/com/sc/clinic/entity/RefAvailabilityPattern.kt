package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "ref_availability_pattern")
data class RefAvailabilityPattern(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "pattern_code", nullable = false, unique = true)
    var patternCode: String,

    @Column(name = "pattern_name", nullable = false)
    var patternName: String,

    @Column(name = "description")
    var description: String?
)

