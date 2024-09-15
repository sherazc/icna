package org.icna.register.service

import org.icna.register.dto.UserProfileDto
import org.icna.register.repository.UserProfileRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.anyLong
import org.mockito.Mockito.anyString

import org.mockito.Mockito.mock
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
    }

    @Test
    fun getUserProfileRepository() {
    }
}