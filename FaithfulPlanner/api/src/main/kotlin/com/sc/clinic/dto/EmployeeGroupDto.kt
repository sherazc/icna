package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class EmployeeGroupDto(
    @param:JsonProperty("id")
    val id: Long?,
    @param:JsonProperty("groupName")
    val groupName: String
)
