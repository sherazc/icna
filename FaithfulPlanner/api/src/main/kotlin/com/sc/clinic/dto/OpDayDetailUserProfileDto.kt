package com.sc.clinic.dto

import jakarta.validation.constraints.Email

class OpDayDetailUserProfileDto (
    var id: Long = 0,
    @field:Email
    var email: String = "",
    var firstName: String = "",
    var lastName: String = "",
    var phoneNumber: String = "",
    var type: MutableList<EmployeeTypeDto> = mutableListOf()
)