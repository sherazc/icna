package com.sc.clinic.dto

import com.sc.clinic.entity.EmployeeType

class EmployeeTypeDto(
    var id: Long?,
    var typeName: String
) {
    constructor(employeeType: EmployeeType):this (
        employeeType.id, employeeType.typeName
    )
}
