package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.OperationDayTeam

data class OperationDayTeamDto(
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("team")
    var team: TeamDto,
    @param:JsonProperty("requiredCount")
    var requiredCount: Int
) {
    constructor(operationDayTeam: OperationDayTeam) : this(
        operationDayTeam.id,
        TeamDto(operationDayTeam.team),
        operationDayTeam.requiredCount
    )
}
