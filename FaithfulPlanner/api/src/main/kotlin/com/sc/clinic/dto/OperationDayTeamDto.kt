package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.OperationDayTeam

class OperationDayTeamDto(
    var id: Long?,
    var team: TeamDto,
    var requiredTeamCount: Int
) {
    constructor(operationDayTeam: OperationDayTeam) : this(
        operationDayTeam.id,
        TeamDto(operationDayTeam.team),
        operationDayTeam.requiredTeamCount
    )
}
