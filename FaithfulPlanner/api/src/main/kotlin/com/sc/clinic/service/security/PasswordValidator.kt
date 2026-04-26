package com.sc.clinic.service.security

import com.sc.clinic.exception.ScException
import org.springframework.stereotype.Service

@Service
class PasswordValidator {
    companion object {
        const val PASSWORD_DESCRIPTION = "Password should be at least 5 characters long"
    }

    fun isValid(password: String?): Boolean {
        password ?: return false
        return password.length >= 5
    }

    fun validatePassword(password: String?) {
        val valid = isValid(password)
        if (!valid) {
            throw ScException(PASSWORD_DESCRIPTION)
        }
    }
}