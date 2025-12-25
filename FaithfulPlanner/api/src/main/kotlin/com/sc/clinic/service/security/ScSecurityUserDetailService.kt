package com.sc.clinic.service.security

import com.sc.clinic.dto.UserProfileDto
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

        if (!username.matches(userNameRegex)) throw UsernameNotFoundException("Invalid user name: $username")

        val userNameParts = username.split("/")
        val companyId = userNameParts[0].trim().toLong()
        val email = userNameParts[1].trim()


        val userProfile: UserProfileDto? = userProfileRepository.findByCompanyIdAndEmail(companyId, email)
        // val userProfileDetails: UserProfileUserDetails = if (userProfile != null) UserProfileUserDetails(userProfile)
        TODO()
    }

    private fun findRoles(companyId: Long, email: String): List<String> = TODO()
}