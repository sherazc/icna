package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Email

class OpDayDetailUserProfileDto (
    @param:JsonProperty("id")
    var id: Long = 0,
    @param:JsonProperty("email")
    @field:Email
    var email: String = "",
    @param:JsonProperty("firstName")
    var firstName: String = "",
    @param:JsonProperty("lastName")
    var lastName: String = "",
    @param:JsonProperty("phoneNumber")
    var phoneNumber: String = "",
    @param:JsonProperty("types")
    var type: List<OpDayEmployeeTypeDto> = mutableListOf()
)