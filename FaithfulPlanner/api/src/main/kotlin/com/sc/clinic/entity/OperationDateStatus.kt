package com.sc.clinic.entity

enum class OperationDateStatus(
    val statusCode: String,
    val statusName: String
) {
    SCHEDULED("SCHEDULED", "Scheduled"),
    CONFIRMED("CONFIRMED", "Confirmed"),
    CANCELLED("CANCELLED", "Cancelled"),
    COMPLETED("COMPLETED", "Completed");

    companion object {
        fun fromCode(code: String): OperationDateStatus? {
            return entries.find { it.statusCode == code }
        }
    }
}

