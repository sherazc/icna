package com.sc.clinic.dto

data class PasswordUpdateDto(
    var userProfileId: Long,
    /**
     * currentPassword is optional because this DTO is also used for forget password.
     */
    var currentPassword: String? = null,
    var newPassword: String
)
