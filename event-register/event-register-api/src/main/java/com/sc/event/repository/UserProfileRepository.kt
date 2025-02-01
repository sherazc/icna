package com.sc.event.repository

import com.sc.event.dto.UserProfileDto
import com.sc.event.entity.auth.UserProfile
import com.sc.event.entity.auth.UserRole
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import java.util.*

interface UserProfileRepository : CrudRepository<UserProfile, Long> {
    @Query("""
        select new com.sc.event.dto.UserProfileDto(
            u.id, u.email, u.userPassword, u.event.id)
        from UserProfile u
        where lower(u.email) = lower(:email)
        and u.event.id = :event
    """)
    fun findByEventAndEmail(event:Long, email: String): Optional<UserProfileDto>

    @Query("""
        select new com.sc.event.dto.UserProfileDto(
            u.id, u.email, u.userPassword, u.event.id)
        from UserProfile u
        join u.userRoles ur
        where lower(u.email) = lower(:email)
        and ur.roleName = 'ADMIN'
    """)
    fun findEventAdmins(email: String): List<UserProfileDto>

    @Query("""
        select u.userRoles from UserProfile u
        where lower(u.email) = lower(:email)
        and u.event.id = :event
    """)
    fun findRolesByEventAndEmail(event:Long, email: String): Set<UserRole>

    @Query("""
        select new com.sc.event.dto.UserProfileDto(
            u.id, u.email, u.userPassword, u.event.id)
        from UserProfile u 
        join u.userRoles ur 
        where lower(ur.roleName) = lower(:roleName)
        and u.event.id = :eventId
       """)
    fun findByEventIdAndRoleName(
        @Param("eventId") eventId: Long,
        @Param("roleName") roleName: String): List<UserProfileDto>
}