package com.sc.clinic.dto

import com.sc.clinic.entity.OperationDate
import com.sc.clinic.util.DateUtils

class OperationDateDto (
    var id: Long?,
    var companyId: Long,
    var serviceDateString: String,
    var notes: String?
){
    constructor(operationDate: OperationDate):this (
        operationDate.id,
        operationDate.company.id!!,
        DateUtils.dateToIso(operationDate.serviceDate),
        operationDate.notes
    )
}