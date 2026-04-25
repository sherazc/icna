package com.sc.clinic.service.security

import com.sc.clinic.service.model.AuthRole
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class PermissionValidatorTest {
    lateinit var target: PermissionValidator

    @BeforeEach
    fun setUp() {
        target = PermissionValidator()
    }

    @Test
    fun isSelfOrHasRoles() {
        var allowed = target.isSelfOrHasRoles(
            null,
            listOf(AuthRole.ADMIN.name),
            null,
            listOf(AuthRole.ADMIN.name))
        assertTrue(allowed)

        allowed = target.isSelfOrHasRoles(
            null,
            listOf(),
            null,
            listOf())
        assertTrue(allowed)

        allowed = target.isSelfOrHasRoles(
            null,
            null,
            null,
            null)
        assertTrue(allowed)

        allowed = target.isSelfOrHasRoles(
            null,
            null,
            null,
            listOf(AuthRole.ADMIN.name))
        assertFalse(allowed)

        allowed = target.isSelfOrHasRoles(
            1,
            listOf(AuthRole.BASIC_USER.name),
            1,
            listOf(AuthRole.ADMIN.name))
        assertTrue(allowed)

        allowed = target.isSelfOrHasRoles(
            1,
            listOf(AuthRole.BASIC_USER.name),
            2,
            listOf(AuthRole.ADMIN.name))
        assertFalse(allowed)
    }

    @Test
    fun validateSelfOrHasRoles() {
    }

}