package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "ref_provider_type")
data class RefProviderType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "type_name", nullable = false)
    var typeName: String
)

