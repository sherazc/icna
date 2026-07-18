package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "team")
data class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    var company: Company,

    @Column(name = "team_name", nullable = false)
    var teamName: String,

    @OneToMany(mappedBy = "team", fetch = FetchType.LAZY)
    var employeeTypes: MutableSet<TeamEmployeeType> = mutableSetOf()
)
