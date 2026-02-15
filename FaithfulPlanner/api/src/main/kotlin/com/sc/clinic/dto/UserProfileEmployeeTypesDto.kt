package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.UserProfile
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

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
    constructor(userProfile: UserProfile, employeeTypesDto: List<EmployeeTypeDto>)
}