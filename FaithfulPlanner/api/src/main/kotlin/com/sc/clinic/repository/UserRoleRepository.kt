package com.sc.clinic.repository

import com.sc.clinic.entity.UserRole
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRoleRepository : JpaRepository<UserRole, Long> {

    fun findByRoleName(roleName: String): Optional<UserRole>

    fun existsByRoleName(roleName: String): Boolean
}

