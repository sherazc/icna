package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.Team
import com.sc.clinic.entity.TeamEmployeeType

data class TeamDto(
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("teamName")
    var teamName: String,
    @param:JsonProperty("teamEmployeeTypes")
    var teamEmployeeTypes: List<TeamEmployeeTypeDto> = mutableListOf()
) {
    constructor(team: Team) : this(
        team.id,
        team.teamName,
        team.teamEmployeeTypes.map { TeamEmployeeTypeDto(it) }
    )

    constructor(team: Team, employeeTypes: List<TeamEmployeeType>) : this(
        team.id,
        team.teamName,
        employeeTypes.map { TeamEmployeeTypeDto(it) }
    )
}
