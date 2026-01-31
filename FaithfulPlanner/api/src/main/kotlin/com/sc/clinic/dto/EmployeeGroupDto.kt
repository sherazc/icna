package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

open class EmployeeGroupDto(
    @param:JsonProperty("id")
    open val id: Long?,
    @param:JsonProperty("groupName")
    open val groupName: String
)
