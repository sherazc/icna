package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.UserProfile
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

class UserProfileDto(
    @JsonProperty("id")
    var id: Long?,
    @JsonProperty("email")
    @field:Email
    @field:NotBlank
    var email: String,
    @JsonProperty("userPassword")
    var usersPassword: String?,
    @JsonProperty("comanyId")
    var companyId: Long?
) {
    constructor(userProfile: UserProfile): this(
        userProfile.id, userProfile.email, userProfile.userPassword, userProfile.company.id
    )
}