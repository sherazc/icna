package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.util.DateUtils

open class OperationDayDto (
    @param:JsonProperty("id")
    var id: Long?,
    @param:JsonProperty("companyId")
    var companyId: Long,
    @param:JsonProperty("serviceDateString")
    var serviceDateString: String,
    @param:JsonProperty("notes")
    var notes: String?
){
    constructor(operationDay: OperationDay):this (
        operationDay.id,
        operationDay.company.id!!,
        DateUtils.dateToIso(operationDay.serviceDate),
        operationDay.notes
    )
}