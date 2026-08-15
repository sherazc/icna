package com.sc.clinic.dto

import com.sc.clinic.entity.TeamEmployeeType

class TeamEmployeeTypeDto(
    var id: Long?,
    var employeeType: EmployeeTypeDto,
    var requiredEmployeeTypeCount: Int
) {
    constructor(teamEmployeeType: TeamEmployeeType) : this(
        teamEmployeeType.id,
        EmployeeTypeDto(teamEmployeeType.employeeType),
        teamEmployeeType.requiredEmployeeTypeCount
    )
}
