package com.sc.clinic.service.security

import com.sc.clinic.exception.ScException
import org.springframework.stereotype.Component

@Component
class PermissionValidator {
    fun isSelfOrHasRoles(
        selfUserProfileId: Long?,
        selfRoles: List<String>?,
        modifyUserProfileId: Long?,
        shouldHaveRoles: List<String>?): Boolean {

        if (modifyUserProfileId != null && selfUserProfileId != null && modifyUserProfileId == selfUserProfileId) {
            return true
        }

        return shouldHaveRoles?.all { role -> selfRoles?.contains(role) ?: false } ?: false
    }

    fun validateSelfOrHasRoles(
        selfUserProfileId: Long,
        selfRoles: List<String>,
        modifyUserProfileId: Long?,
        shouldHaveRoles: List<String>) {
        val valid = isSelfOrHasRoles(selfUserProfileId, selfRoles, modifyUserProfileId, shouldHaveRoles)
        if (!valid) {
            throw ScException("Authentication Failed")
        }
    }
}