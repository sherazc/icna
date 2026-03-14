package com.sc.clinic.dto

import com.sc.clinic.entity.OperationDate
import com.sc.clinic.util.DateUtils

class OperationDateDto (
    var id: Long?,
    var companyId: Long?,
    var operationDateString: String?,
    var notes: String?
){
    constructor(operationDate: OperationDate):this (
        operationDate.id,
        operationDate.company.id,
        DateUtils.dateToIso(operationDate.operationDate),
        operationDate.notes
    )
}