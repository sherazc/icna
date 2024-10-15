package com.sc.event.service

import com.sc.event.entity.auth.UserProfile
import com.sc.event.entity.auth.UserRole
import com.sc.event.repository.UserRoleRepository
import com.sc.event.service.model.AuthRole
import org.springframework.stereotype.Service

@Service
class UserRoleService(private val userRoleRepository: UserRoleRepository) {
    fun getByRoleName(roleName: String): UserRole? = userRoleRepository.findByRoleName(roleName)

    fun addRoles(userProfile: UserProfile, vararg roleNames: AuthRole) {
        roleNames.forEach { authRole: AuthRole -> addRole(userProfile, authRole)}
    }

    fun addRole(userProfile: UserProfile, roleName: AuthRole) {
        if (userProfile.userRoles == null) {
            userProfile.userRoles = mutableSetOf()
        }

        val containsRole = userProfile.userRoles!!.any { userRole: UserRole -> userRole.roleName == roleName.toString() }

        if (!containsRole) {
            getByRoleName(roleName.toString())?.let { r -> userProfile.userRoles!!.add(r)}
        }
    }
}
