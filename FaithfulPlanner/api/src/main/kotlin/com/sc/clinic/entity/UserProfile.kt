package com.sc.clinic.entity

import jakarta.persistence.*

@Entity
@Table(name = "user_profile")
data class UserProfile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(name = "email", nullable = false)
    var email: String,

    @Column(name = "user_password", length = 1024)
    var userPassword: String? = null,

    @Column(name = "first_name")
    var firstName: String? = null,

    @Column(name = "last_name")
    var lastName: String? = null,

    @Column(name = "phone_number")
    var phoneNumber: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    var company: Company,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_group_id")
    var employeeGroup: EmployeeGroup? = null,

    @ManyToMany(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
    @JoinTable(
        name = "m2m_user_profile_user_role",
        joinColumns = [JoinColumn(name = "user_profile_id")],
        inverseJoinColumns = [JoinColumn(name = "user_role_id")]
    )
    var userRoles: MutableSet<UserRole>? = mutableSetOf(),

    @ManyToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL])
    @JoinTable(
        name = "m2m_user_profile_employee_type",
        joinColumns = [JoinColumn(name = "user_profile_id")],
        inverseJoinColumns = [JoinColumn(name = "employee_type_id")]
    )
    var employeeTypes: MutableSet<EmployeeType> = mutableSetOf()
)

