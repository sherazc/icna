package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.EmployeeGroup
import com.sc.clinic.entity.EmployeeType

data class EmployeeGroupTypesDto(
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("groupName")
    var groupName: String,
    @param:JsonProperty("employeeTypes")
    var employeeTypes: List<EmployeeTypeDto> = mutableListOf()
) {
    constructor(group: EmployeeGroup, types: List<EmployeeType>):this (
        group.id,
        group.groupName,
        types.map { EmployeeTypeDto(it) }.sortedBy { it.typeName }
    )
}

