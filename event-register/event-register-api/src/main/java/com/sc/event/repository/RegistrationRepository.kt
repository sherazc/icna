package com.sc.event.repository

import com.sc.event.entity.event.Registration
import org.springframework.data.repository.CrudRepository
import java.util.Optional

interface RegistrationRepository : CrudRepository<Registration, Long> {
    fun getByUserProfileId(userProfileId: Long):Optional<Registration>
    fun existsByUserProfileId(userProfileId: Long):Boolean
}