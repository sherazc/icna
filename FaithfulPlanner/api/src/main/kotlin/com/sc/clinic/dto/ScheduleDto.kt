package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

class ScheduleDto (
    var id: Long?,
    var operationDayId: Long,
    var userProfileId: Long
)