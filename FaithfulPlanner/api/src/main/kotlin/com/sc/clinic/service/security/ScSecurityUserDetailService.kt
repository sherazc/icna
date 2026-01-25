package com.sc.clinic.service.security

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.dto.UserProfileUserDetails
import com.sc.clinic.entity.UserRole
import com.sc.clinic.service.UserProfileService
import com.sc.clinic.service.model.AuthRole
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import kotlin.plus
import kotlin.text.contains
import kotlin.text.toList
import kotlin.toString

@Service
class ScSecurityUserDetailService(val userProfileService: UserProfileService) : UserDetailsService {
    // Email Regex
    val userNameRegex: Regex = "[0-9]*\\/.{2,}@.{2,}\\..{2,}".toRegex();

    override fun loadUserByUsername(username: String): UserDetails {

        if (!username.matches(userNameRegex)) throw UsernameNotFoundException("Invalid user name format: $username")

        val userNameParts = username.split("/")
        val companyId = userNameParts[0].trim().toLong()
        val email = userNameParts[1].trim()

        return userProfileService.findByCompanyIdAndEmail(companyId, email)
            // ?.takeIf { it.isActive }
            ?.let { userProfile -> UserProfileUserDetails(UserProfileDto(userProfile), getRoles(companyId, email)) }
            ?: throw UsernameNotFoundException("Can not find user. companyId $companyId, email $email")
    }

    private fun getRoles(companyId: Long, email: String): List<String> {
        val dbRoles = userProfileService.findRolesByCompanyAndEmail(companyId, email)
            // .mapTo(destination mutable collection, transformer lambda)
            // if the last parameter is a lambda then it can be written outside () parenthesis
            .mapTo(mutableSetOf()) { it.roleName }

        val additionalRoles = when {
            AuthRole.MASTER.toString() in dbRoles -> AuthRole.entries.map { it.toString() }
            AuthRole.ADMIN.toString() in dbRoles -> listOf(AuthRole.BASIC_USER.toString())
            else -> emptyList()
        }

        return (dbRoles + additionalRoles).toList()
    }

}