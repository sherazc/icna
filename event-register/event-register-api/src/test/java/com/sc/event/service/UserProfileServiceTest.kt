package com.sc.event.service

import com.sc.event.dto.UserProfileDto
import com.sc.event.exception.ErExceptionBadRequest
import com.sc.event.repository.UserProfileRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito
import org.mockito.Mockito.anyLong
import org.mockito.Mockito.anyString

import org.mockito.Mockito.mock
import org.mockito.Mockito.times
import org.mockito.Mockito.verify
import java.util.Optional
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class UserProfileServiceTest {

    lateinit var userProfileRepository: UserProfileRepository

    lateinit var underTest: UserProfileService

    @BeforeEach
    fun setUp() {
        userProfileRepository = mock(UserProfileRepository::class.java)
        underTest = UserProfileService(userProfileRepository)
    }

    @Test
    fun findByEventIdAndUserEmailNoPassword_noEmail() {
        val user = underTest.findByEventIdAndUserEmailNoPassword(1, "")
        assertTrue(user.isEmpty)
    }

    @Test
    fun findByEventIdAndUserEmailNoPassword_notFound() {
        Mockito.`when`(userProfileRepository.findByEventAndEmail(anyLong(), anyString()))
            .thenReturn(Optional.empty())
        val user = underTest.findByEventIdAndUserEmailNoPassword(1, "abc")
        assertTrue(user.isEmpty)
    }

    @Test
    fun findByEventIdAndUserEmailNoPassword() {
        val expected = UserProfileDto(100, "", null, 1)
        Mockito.`when`(userProfileRepository.findByEventAndEmail(anyLong(), anyString()))
            .thenReturn(Optional.of(expected))
        val user = underTest.findByEventIdAndUserEmailNoPassword(1, "abc")
        assertTrue(user.isPresent)
        assertEquals(expected.id, user.get().id)
        assertEquals(expected.email, user.get().email)
        assertEquals(expected.eventId, user.get().eventId)
        assertEquals(expected.userPassword, user.get().userPassword)
    }

    @Test
    fun save() {
    }

    @Test
    fun validateEmail() {
        val email = "email@example.com"

        val expected = UserProfileDto(100, email, null, 1)
        Mockito.`when`(userProfileRepository.findByEventAndEmail(anyLong(), anyString()))
            .thenReturn(Optional.of(expected))

        // On update, the same record is found
        assertDoesNotThrow { underTest.validateEmail(1, UserProfileDto(100, email, null, 1)) }

        // On new registration
        assertThrows<ErExceptionBadRequest> { underTest.validateEmail(1, UserProfileDto(null, email, null, 1)) }

        // On update, different record is found with the same email.
        assertThrows<ErExceptionBadRequest> { underTest.validateEmail(1, UserProfileDto(200, email, null, 1)) }

        verify(userProfileRepository, times(3)).findByEventAndEmail(anyLong(), anyString())
    }

    @Test
    fun getUserProfileRepository() {
    }
}