package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.UserProfile

class UserProfileEmployeeTypesDto(
    id: Long?,
    email: String,
    usersPassword: String?,
    companyId: Long?,
    firstName: String? = null,
    lastName: String? = null,
    phoneNumber: String? = null,
    @param:JsonProperty("employeeTypes")
    var employeeTypesDto: List<EmployeeTypeDto> = mutableListOf()
) : UserProfileDto(
    id, email, usersPassword, companyId, firstName, lastName, phoneNumber
) {
    constructor(userProfile: UserProfile, employeeTypesDto: List<EmployeeTypeDto>): this(
        userProfile.id,
        userProfile.email,
        userProfile.userPassword,
        userProfile.company.id,
        userProfile.firstName,
        userProfile.lastName,
        userProfile.phoneNumber,
        employeeTypesDto
    )
}