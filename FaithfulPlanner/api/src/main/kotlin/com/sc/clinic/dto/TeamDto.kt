package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.Team

data class TeamDto(
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("teamName")
    var teamName: String,
    @param:JsonProperty("employeeTypes")
    var employeeTypes: List<EmployeeTypeDto> = mutableListOf()
) {
    constructor(team: Team) : this(
        team.id,
        team.teamName,
        team.employeeTypes.map { EmployeeTypeDto(it) }
    )
}
