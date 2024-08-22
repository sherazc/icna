package org.icna.register.repository

import org.icna.register.dto.UserProfileDto
import org.icna.register.entity.auth.UserProfile
import org.icna.register.entity.auth.UserRole
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.*

interface UserProfileRepository : CrudRepository<UserProfile, Long> {
    @Query("""
        select new org.icna.register.dto.UserProfileDto(
            u.email, u.userPassword, u.event.id)
        from UserProfile u
        where u.email = :email
        and u.event.id = :event
    """)
    fun findByEventAndEmail(event:Long, email: String): Optional<UserProfileDto>


    @Query("""
        select u.userRoles from UserProfile u
        where u.email = :email
        and u.event.id = :event
    """)
    fun findRolesByEventAndEmail(event:Long, email: String): Set<UserRole>


}