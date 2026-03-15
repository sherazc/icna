package com.sc.clinic.dto

import com.sc.clinic.entity.OperationDay
import com.sc.clinic.util.DateUtils

class OperationDayDto (
    var id: Long?,
    var companyId: Long,
    var serviceDateString: String,
    var notes: String?
){
    constructor(operationDay: OperationDay):this (
        operationDay.id,
        operationDay.company.id!!,
        DateUtils.dateToIso(operationDay.serviceDate),
        operationDay.notes
    )
}