package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class EmployeeGroupTypesDto(
    @param:JsonProperty("id")
    val id: Long?,
    @param:JsonProperty("groupName")
    val groupName: String,
    @param:JsonProperty("employeeTypes")
    val employeeTypes: List<EmployeeTypeDto> = mutableListOf()
)
