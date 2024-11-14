package com.sc.event.service

import com.sc.event.dto.UserProfileDto
import com.sc.event.entity.auth.UserProfile
import com.sc.event.entity.event.Event
import com.sc.event.exception.ErExceptionBadRequest
import com.sc.event.exception.ErExceptionNotFound
import com.sc.event.mapper.UserProfileMapper
import com.sc.event.repository.UserProfileRepository
import com.sc.event.service.model.AuthRole
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserProfileService(
    val userProfileRepository: UserProfileRepository,
    val passwordEncoder: PasswordEncoder,
    val userRoleService: UserRoleService,
    val userProfileMapper: UserProfileMapper) {

    fun getUserProfile(userProfileId: Long): Optional<UserProfileDto> =
        userProfileRepository.findById(userProfileId).map { userProfileMapper.beanToDto(it) }

    fun findByEventIdAndUserEmailNoPassword(eventId: Long, userEmail: String): Optional<UserProfileDto> {
        if (userEmail.isEmpty()) {
            return Optional.empty()
        }
        return userProfileRepository.findByEventAndEmail(eventId, userEmail)
            .map { u ->
                u.userPassword = null
                u
            }
    }

    fun save(event: Event, userProfileDto: UserProfileDto): UserProfile {
        val userProfile = if (userProfileDto.id == null) {
            UserProfile(null, event, userProfileDto.email, encodePassword(userProfileDto.userPassword))
        } else {
            val u = userProfileRepository.findById(userProfileDto.id!!)
                .orElseThrow { ErExceptionNotFound("Can not save User Profile. ${userProfileDto.id} not found") }
            setNewUserProfileValues(userProfileDto, u)
            u
        }

        userRoleService.addRoles(userProfile, AuthRole.BASIC_USER)

        return userProfileRepository.save(userProfile)
    }

    private fun setNewUserProfileValues(userProfileDto: UserProfileDto, userProfile: UserProfile) {
        userProfile.email = userProfileDto.email
        if (userProfileDto.userPassword != null) {
            userProfile.userPassword = encodePassword(userProfileDto.userPassword)
        }
    }

    private fun isValidEmail(eventId: Long, userProfileDto: UserProfileDto): Boolean {
        val userProfileOptional = findByEventIdAndUserEmailNoPassword(eventId, userProfileDto.email)
        var valid = true
        if (userProfileOptional.isPresent) {
            val existingUserId = userProfileOptional.get().id
            val requestUserId = userProfileDto.id

            if (requestUserId == null) {
                valid = false
            } else if (existingUserId != requestUserId) {
                valid = false
            }
        }
        return valid
    }

    fun validateEmail(eventId: Long, userProfileDto: UserProfileDto) {
        if (!isValidEmail(eventId, userProfileDto)) {
            throw ErExceptionBadRequest("""
                Failed to save register. Email already exists. 
                eventId=$eventId
                email=${userProfileDto.email}
            """.trimIndent())
        }
    }

    private fun encodePassword(password: String?): String? =
        if (password.isNullOrEmpty()) password else passwordEncoder.encode(password)

    fun findEventAdmin(eventId: Long): UserProfileDto? {
        val userProfiles = userProfileRepository.findByEventIdAndRoleName(eventId, AuthRole.ADMIN.toString())
            .map { u ->
                u.userPassword = null
                u
            }
        return if (userProfiles.isEmpty()) null else userProfiles[0]
    }
}
