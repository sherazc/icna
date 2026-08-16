package com.sc.clinic.dto

import com.sc.clinic.entity.UserProfile
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

open class UserProfileDto(
    var id: Long?,
    @field:Email
    @field:NotBlank
    var email: String,
    var userPassword: String?,
    var companyId: Long?,
    var firstName: String? = null,
    var lastName: String? = null,
    var phoneNumber: String? = null,
    var employeeGroupId: Long?,
    var employeeTypes: List<EmployeeTypeDto> = mutableListOf()
) {
    constructor(userProfile: UserProfile) : this(
        userProfile.id,
        userProfile.email,
        userProfile.userPassword,
        userProfile.company.id,
        userProfile.firstName,
        userProfile.lastName,
        userProfile.phoneNumber,
        userProfile.employeeGroup?.id,
        userProfile.employeeTypes.map { EmployeeTypeDto(it) }
    )
}