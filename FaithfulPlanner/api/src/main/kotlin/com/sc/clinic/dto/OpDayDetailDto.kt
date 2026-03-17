package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

open class OpDayDetailDto(
    @param:JsonProperty("id")
    var id: Long,
    @param:JsonProperty("companyId")
    var companyId: Long,
    @param:JsonProperty("serviceDateString")
    var serviceDateString: String,
    @param:JsonProperty("notes")
    var notes: String?,
    var opDayDetailEmployeeGroups: List<OpDayDetailEmployeeGroupDto> = mutableListOf()
) {
}