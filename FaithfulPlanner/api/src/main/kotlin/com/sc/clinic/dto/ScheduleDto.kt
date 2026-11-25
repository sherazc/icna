package com.sc.clinic.dto

data class ScheduleDto (
    var id: Long? = null,
    var operationDayId: Long = 0,
    var userProfileId: Long = 0,
    var teamId: Long? = null,
    var employeeTypeId: Long? = null,
    var teamInstanceNo: Int? = null
)