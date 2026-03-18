package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

class OpDayDetailEmployeeGroupDto(
    @param:JsonProperty("id")
    var id: Long = 0,
    @param:JsonProperty("groupName")
    var groupName: String = "",
    @param:JsonProperty("users")
    var users: MutableList<OpDayDetailUserProfileDto> = mutableListOf()
)