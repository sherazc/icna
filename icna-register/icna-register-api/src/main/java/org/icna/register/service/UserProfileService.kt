package org.icna.register.service

import org.icna.register.dto.UserProfileDto
import org.icna.register.entity.auth.UserProfile
import org.icna.register.entity.event.Event
import org.icna.register.exception.ErExceptionBadRequest
import org.icna.register.repository.UserProfileRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class UserProfileService(val userProfileRepository: UserProfileRepository) {

    fun findByEventIdAndUserEmailNoPassword(eventId: Long, userEmail: String): Optional<UserProfileDto> {
        if (userEmail.isEmpty()) {
            return Optional.empty()
        }
        return userProfileRepository.findByEventAndEmail(eventId, userEmail)
            .map { u -> u.userPassword = null
                u
            }
    }

    fun save(event: Event, userProfileDto: UserProfileDto): UserProfile = userProfileRepository.save(
            UserProfile(null, event, userProfileDto.email, userProfileDto.userPassword))

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
}