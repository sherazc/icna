package com.sc.clinic.entity

enum class AvailabilityPattern(
    val patternCode: String,
    val patternName: String,
    val description: String
) {
    WEEKENDS(
        "WEEKENDS",
        "All Weekends",
        "Available on all Saturdays and Sundays"
    ),
    SATURDAY(
        "SATURDAY",
        "Saturdays Only",
        "Available on Saturdays only"
    ),
    SUNDAY(
        "SUNDAY",
        "Sundays Only",
        "Available on Sundays only"
    ),
    ANY_DAY(
        "ANY_DAY",
        "Any Day",
        "Available on any day of the week"
    ),
    SPECIFIC_DATE(
        "SPECIFIC_DATE",
        "Specific Dates",
        "Available on specific dates only (requires date_availability entries)"
    );

    companion object {
        fun fromCode(code: String): AvailabilityPattern? {
            return values().find { it.patternCode == code }
        }
    }
}

