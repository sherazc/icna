package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.EmployeeType

data class EmployeeTypeDto(
    @param:JsonProperty("id")
    val id: Long?,
    @param:JsonProperty("typeName")
    val typeName: String
) {
    constructor(employeeType: EmployeeType):this (
        employeeType.id, employeeType.typeName
    )
}
