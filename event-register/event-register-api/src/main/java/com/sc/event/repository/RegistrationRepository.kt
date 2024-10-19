package com.sc.event.repository

import com.sc.event.entity.event.Registration
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.Optional

interface RegistrationRepository : CrudRepository<Registration, Long> {
    fun getByUserProfileId(userProfileId: Long): Optional<Registration>

    @Query("""
        select r.id from Registration r
        where r.userProfile.id = :userProfileId
    """)
    fun getIdByUserProfileId(userProfileId: Long): Optional<Long>
}