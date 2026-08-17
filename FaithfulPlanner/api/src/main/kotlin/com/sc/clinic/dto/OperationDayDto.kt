package com.sc.clinic.dto

import com.sc.clinic.entity.OperationDay
import com.sc.clinic.util.DateUtils

/**
 * Used to list Operation days on Dashboard screen
 */
open class OperationDayDto(
    var id: Long?,
    var companyId: Long,
    var serviceDateString: String,
    var notes: String?,
    var requiredOperationDayTeams: List<OperationDayTeamDto> = mutableListOf()
) {
    constructor(operationDay: OperationDay) : this(
        operationDay.id,
        operationDay.company.id!!,
        DateUtils.dateToIso(operationDay.serviceDate),
        operationDay.notes,
        operationDay.requiredOperationDayTeams.map { OperationDayTeamDto(it) }
    )
}