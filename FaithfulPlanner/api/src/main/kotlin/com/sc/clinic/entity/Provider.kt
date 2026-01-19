package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "provider")
data class Provider(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long?,

    @Column(name = "first_name", nullable = false)
    var firstName: String,

    @Column(name = "last_name", nullable = false)
    var lastName: String,

    @Column(name = "email")
    var email: String?,

    @Column(name = "phone_number")
    var phoneNumber: String?,

    @Column(name = "company_id")
    var companyId: Long?,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "m2m_provider_provider_type",
        joinColumns = [JoinColumn(name = "provider_id")],
        inverseJoinColumns = [JoinColumn(name = "provider_type_id")]
    )
    var providerTypes: MutableSet<ProviderType> = mutableSetOf()
)

