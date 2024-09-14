package org.icna.register.service

import org.icna.register.dto.UserProfileDto
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
}