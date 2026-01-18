package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "ref_worker_type")
data class RefWorkerType(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "type_name", nullable = false)
    var typeName: String
)

