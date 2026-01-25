package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class EmployeeTypeDto(
    @param:JsonProperty("id")
    val id: Long?,
    @param:JsonProperty("typeName")
    val typeName: String
)
