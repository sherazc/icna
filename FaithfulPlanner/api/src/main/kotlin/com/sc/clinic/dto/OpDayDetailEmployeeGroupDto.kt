package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

open class OpDayDetailEmployeeGroupDto(
    @param:JsonProperty("id")
    val id: Long,
    @param:JsonProperty("groupName")
    val groupName: String
)