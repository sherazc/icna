package org.icna.register.repository

import org.icna.register.entity.auth.UserProfile
import org.icna.register.entity.event.Registration
import org.springframework.data.repository.CrudRepository
import java.util.Optional

interface UserProfileRepository : CrudRepository<UserProfile, Long> {
    fun findByEmailIgnoreCase(email: String): Optional<UserProfile>
}