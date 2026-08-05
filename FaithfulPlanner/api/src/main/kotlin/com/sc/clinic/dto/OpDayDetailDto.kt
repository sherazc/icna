package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.util.DateUtils

/**
 * Child of OperationDayDto. All properties of OperationDayDto are available to this class.
 *
 * When the Operation day row is selected on Dashboard, this DTO populates the bottom details section.
 */
class OpDayDetailDto(
    id: Long? = 0,
    companyId: Long = 0,
    serviceDateString: String = "",
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