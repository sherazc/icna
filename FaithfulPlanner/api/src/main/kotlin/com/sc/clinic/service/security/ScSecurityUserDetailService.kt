package com.sc.clinic.service.security

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.dto.UserProfileUserDetails
import com.sc.clinic.service.UserProfileService
import com.sc.clinic.service.model.AuthRole
import jakarta.transaction.Transactional
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class ScSecurityUserDetailService(val userProfileService: UserProfileService) : UserDetailsService {
    // Email Regex
    val userNameRegex: Regex = "[0-9]*\\/.{2,}@.{2,}\\..{2,}".toRegex();

    @Transactional
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

        // when is equivalent to switch in Java/JavaScript
        val additionalRoles = when {
            AuthRole.MASTER.toString() in dbRoles -> AuthRole.entries.map { it.toString() }
            AuthRole.ADMIN.toString() in dbRoles -> listOf(AuthRole.BASIC_USER.toString())
            else -> emptyList()
        }

        // "+" operator can be used to combine 2 collection and create a new collections
        return (dbRoles + additionalRoles).toList()
    }
}