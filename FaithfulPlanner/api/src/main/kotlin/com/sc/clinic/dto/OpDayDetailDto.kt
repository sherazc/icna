package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty

open class OpDayDetailDto(
    @param:JsonProperty("id")
    var id: Long = 0,
    @param:JsonProperty("companyId")
    var companyId: Long = 0,
    @param:JsonProperty("serviceDateString")
    var serviceDateString: String = "",
    @param:JsonProperty("notes")
    var notes: String? = "",
    var opDayDetailEmployeeGroups: MutableList<OpDayDetailEmployeeGroupDto> = mutableListOf()
) {
}