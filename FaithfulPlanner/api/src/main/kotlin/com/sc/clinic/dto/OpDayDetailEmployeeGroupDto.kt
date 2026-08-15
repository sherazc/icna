package com.sc.clinic.dto

class OpDayDetailEmployeeGroupDto(
    var id: Long = 0,
    var groupName: String = "",
    var users: MutableList<OpDayDetailUserProfileDto> = mutableListOf()
)