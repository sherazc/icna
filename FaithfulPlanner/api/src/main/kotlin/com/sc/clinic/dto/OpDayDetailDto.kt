package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.util.DateUtils

open class OpDayDetailDto(
    @JsonProperty("id")
    id: Long? = 0,
    @JsonProperty("companyId")
    companyId: Long = 0,
    @JsonProperty("serviceDateString")
    serviceDateString: String = "",
    @JsonProperty("notes")
    notes: String? = "",
    var groups: MutableList<OpDayDetailEmployeeGroupDto> = mutableListOf(),
    employeeTypes: List<EmployeeTypeDto> = mutableListOf()
) : OperationDayDto(id, companyId, serviceDateString, notes, employeeTypes) {
    // Getters are used to deserialize JSON/Jackson
    fun getServiceDateFormatted(): String {
        return DateUtils.isoToMonthDayYear(serviceDateString)
    }

    // Getters are used to deserialize JSON/Jackson
    fun getServiceDateDayOfWeek(): String {
        return DateUtils.isoToDayOfWeek(serviceDateString)
    }
}