package com.sc.clinic.service.security

import com.sc.clinic.dto.UserProfileUserDetails
import com.sc.clinic.repository.UserProfileRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class ScSecurityUserDetailService(val userProfileRepository: UserProfileRepository) : UserDetailsService {
    val userNameRegex: Regex = "[0-9]*\\/.{2,}@.{2,}\\..{2,}".toRegex();

    override fun loadUserByUsername(username: String): UserDetails {

        if (!username.matches(userNameRegex)) throw UsernameNotFoundException("Invalid user name format: $username")

        val userNameParts = username.split("/")
        val companyId = userNameParts[0].trim().toLong()
        val email = userNameParts[1].trim()

        return userProfileRepository.findByCompanyIdAndEmail(companyId, email)
            // ?.takeIf { it.isActive }
            ?.let { userProfile -> UserProfileUserDetails(userProfile, getRoles(companyId, email)) }
            ?: throw UsernameNotFoundException("Can not find user. companyId $companyId, email $email")
    }

    private fun getRoles(companyId: Long, email: String): List<String> =
        userProfileRepository.findRolesByCompanyAndEmail(companyId, email).map { it.roleName }
}