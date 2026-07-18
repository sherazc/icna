package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.TeamEmployeeType

data class TeamEmployeeTypeDto(
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("employeeType")
    var employeeType: EmployeeTypeDto,
    @param:JsonProperty("requiredCount")
    var requiredCount: Int
) {
    constructor(teamEmployeeType: TeamEmployeeType) : this(
        teamEmployeeType.id,
        EmployeeTypeDto(teamEmployeeType.employeeType),
        teamEmployeeType.requiredCount
    )
}
