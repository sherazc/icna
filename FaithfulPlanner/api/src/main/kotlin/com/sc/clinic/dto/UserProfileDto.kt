package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.UserProfile
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

open class UserProfileDto(
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("email")
    @field:Email
    @field:NotBlank
    var email: String,
    @param:JsonProperty("usersPassword")
    var usersPassword: String?,
    @param:JsonProperty("companyId")
    var companyId: Long?,
    @param:JsonProperty("firstName")
    var firstName: String? = null,
    @param:JsonProperty("lastName")
    var lastName: String? = null,
    @param:JsonProperty("phoneNumber")
    var phoneNumber: String? = null,
    @param:JsonProperty("employeeTypes")
    var employeeTypesDto: List<EmployeeTypeDto> = mutableListOf()
) {
    constructor(userProfile: UserProfile): this(
        userProfile.id,
        userProfile.email,
        userProfile.userPassword,
        userProfile.company.id,
        userProfile.firstName,
        userProfile.lastName,
        userProfile.phoneNumber,
        userProfile.employeeTypes.map { EmployeeTypeDto(it) }
    )
}