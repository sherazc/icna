package com.sc.clinic.entity

enum class EmployeeTypeGroup(
    val groupCode: String,
    val groupName: String,
    val description: String
) {
    PROVIDER("PROVIDER", "Provider", "Medical providers such as doctors and physicians"),
    VOLUNTEER("VOLUNTEER", "Volunteer", "Volunteer staff and support personnel");

    companion object {
        fun fromCode(code: String): EmployeeTypeGroup? {
            return values().find { it.groupCode == code }
        }
    }
}

