package com.sc.clinic.dto

class PasswordUpdateDto(
    var userProfileId: Long,
    /**
     * currentPassword is optional because this DTO is also used for forget password.
     */
    var currentPassword: String? = null,
    var newPassword: String
)
