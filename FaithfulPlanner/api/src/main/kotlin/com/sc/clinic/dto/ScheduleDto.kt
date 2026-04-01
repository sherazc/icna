package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ScheduleDto (
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("operationDayId")
    var operationDayId: Long,
    @param:JsonProperty("userProfileId")
    var userProfileId: Long
)