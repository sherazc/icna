package com.sc.clinic.dto

import jakarta.validation.Valid

class RegistrationDto(
    @field:Valid
    var company: CompanyDto,
    @field:Valid
    var userProfile: UserProfileDto)
