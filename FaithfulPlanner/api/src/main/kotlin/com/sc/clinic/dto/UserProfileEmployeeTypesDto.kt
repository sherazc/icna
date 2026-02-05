package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.UserProfile

class UserProfileEmployeeTypesDto(
    userProfile: UserProfile,
    @param:JsonProperty("employeeTypes")
    var employeeTypesDto: List<EmployeeTypeDto> = mutableListOf())
    : UserProfileDto(userProfile)