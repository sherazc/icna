package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.util.DateUtils

open class OpDayDetailDto(
    @param:JsonProperty("id")
    var id: Long = 0,
    @param:JsonProperty("companyId")
    var companyId: Long = 0,
    @param:JsonProperty("serviceDateString")
    var serviceDateString: String = "",
    @param:JsonProperty("notes")
    var notes: String? = "",
    var groups: MutableList<OpDayDetailEmployeeGroupDto> = mutableListOf()
) {
    // Getters are used to deserialize JSON/Jackson
    fun getServiceDateFormated(): String {
        return DateUtils.isoToMonthDayYear(serviceDateString)
    }

    // Getters are used to deserialize JSON/Jackson
    fun getServiceDateDayOfWeek(): String {
        return DateUtils.isoToDayOfWeek(serviceDateString)
    }
}