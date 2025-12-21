package com.sc.clinic.repository

import com.sc.clinic.entity.UserProfile
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserProfileRepository : JpaRepository<UserProfile, Long> {

    fun findByEmail(email: String): Optional<UserProfile>

    fun existsByEmail(email: String): Boolean

    fun findByCompanyId(companyId: Long): List<UserProfile>

    @Query("SELECT up FROM UserProfile up JOIN FETCH up.roles WHERE up.email = :email")
    fun findByEmailWithRoles(@Param("email") email: String): Optional<UserProfile>

    @Query("SELECT up FROM UserProfile up JOIN up.roles r WHERE r.roleName = :roleName")
    fun findByRoleName(@Param("roleName") roleName: String): List<UserProfile>

    @Query("SELECT up FROM UserProfile up WHERE up.company.id = :companyId AND EXISTS (SELECT 1 FROM up.roles r WHERE r.roleName = :roleName)")
    fun findByCompanyIdAndRoleName(@Param("companyId") companyId: Long, @Param("roleName") roleName: String): List<UserProfile>
}

