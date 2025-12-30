package com.sc.clinic.service

import com.sc.clinic.entity.UserProfile
import com.sc.clinic.entity.UserRole
import com.sc.clinic.repository.UserRoleRepository
import com.sc.clinic.service.model.AuthRole
import org.springframework.stereotype.Service

@Service
class UserRoleService (private val userRoleRepository: UserRoleRepository) {
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