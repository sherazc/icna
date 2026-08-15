package com.sc.clinic.dto

import com.sc.clinic.entity.EmployeeGroup
import com.sc.clinic.entity.EmployeeType

class EmployeeGroupTypesDto(
    var id: Long?,
    var groupName: String,
    var employeeTypes: List<EmployeeTypeDto> = mutableListOf()
) {
    constructor(group: EmployeeGroup, types: List<EmployeeType>):this (
        group.id,
        group.groupName,
        types.map { EmployeeTypeDto(it) }.sortedBy { it.typeName }
    )
}

