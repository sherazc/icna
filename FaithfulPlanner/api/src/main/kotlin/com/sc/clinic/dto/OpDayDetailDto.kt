package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.util.DateUtils

/**
 * When the Operation day row is selected on Dashboard, this DTO populates the bottom details section.
 */
open class OpDayDetailDto(
    @JsonProperty("id")
    id: Long? = 0,
    @JsonProperty("companyId")
    companyId: Long = 0,
    @JsonProperty("serviceDateString")
    serviceDateString: String = "",
    @JsonProperty("notes")
    notes: String? = "",
    requiredTeams: List<OperationDayTeamDto> = mutableListOf(),
    var groups: MutableList<OpDayDetailEmployeeGroupDto> = mutableListOf()
) : OperationDayDto(id, companyId, serviceDateString, notes, requiredTeams) {
    // Getters are used to deserialize JSON/Jackson
    fun getServiceDateFormatted(): String {
        return DateUtils.isoToMonthDayYear(serviceDateString)
    }

    // Getters are used to deserialize JSON/Jackson
    fun getServiceDateDayOfWeek(): String {
        return DateUtils.isoToDayOfWeek(serviceDateString)
    }
}