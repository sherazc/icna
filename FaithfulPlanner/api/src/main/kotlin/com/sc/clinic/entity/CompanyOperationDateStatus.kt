package com.sc.clinic.entity

enum class CompanyOperationDateStatus(
    val statusCode: String,
    val statusName: String
) {
    SCHEDULED("SCHEDULED", "Scheduled"),
    CONFIRMED("CONFIRMED", "Confirmed"),
    CANCELLED("CANCELLED", "Cancelled"),
    COMPLETED("COMPLETED", "Completed");

    companion object {
        fun fromCode(code: String): CompanyOperationDateStatus? {
            return entries.find { it.statusCode == code }
        }
    }
}

