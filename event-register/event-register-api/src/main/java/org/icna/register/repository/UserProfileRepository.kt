package org.event.register.repository

import org.event.register.dto.UserProfileDto
import org.event.register.entity.auth.UserProfile
import org.event.register.entity.auth.UserRole
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.*

interface UserProfileRepository : CrudRepository<UserProfile, Long> {
    @Query("""
        select new org.event.register.dto.UserProfileDto(
            u.id, u.email, u.userPassword, u.event.id)
        from UserProfile u
        where lower(u.email) = lower(:email)
        and u.event.id = :event
    """)
    fun findByEventAndEmail(event:Long, email: String): Optional<UserProfileDto>


    @Query("""
        select u.userRoles from UserProfile u
        where lower(u.email) = lower(:email)
        and u.event.id = :event
    """)
    fun findRolesByEventAndEmail(event:Long, email: String): Set<UserRole>


}