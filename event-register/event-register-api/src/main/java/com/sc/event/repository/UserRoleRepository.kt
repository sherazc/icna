package com.sc.event.repository

import com.sc.event.entity.auth.UserRole
import org.springframework.data.repository.CrudRepository

interface UserRoleRepository : CrudRepository<UserRole, Long> {
    fun findByRoleName(name: String): UserRole?
}