package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class EmployeeGroupTypesDto(
    @param:JsonProperty("id")
    override val id: Long?,
    @param:JsonProperty("groupName")
    override val groupName: String,
    @param:JsonProperty("employeeTypes")
    val employeeTypes: List<EmployeeTypeDto> = mutableListOf()
) : EmployeeGroupDto(id, groupName)
