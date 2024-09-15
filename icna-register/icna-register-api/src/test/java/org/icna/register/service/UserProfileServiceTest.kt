package org.icna.register.service

import org.icna.register.repository.UserProfileRepository
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

import org.mockito.Mockito.mock

class UserProfileServiceTest {

    lateinit var userProfileRepository: UserProfileRepository

    @BeforeEach
    fun setUp() {
        userProfileRepository = mock(UserProfileRepository::class.java)
    }

    @Test
    fun findByEventIdAndUserEmailNoPassword() {




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