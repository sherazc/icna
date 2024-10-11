package com.sc.event.service.security

import com.sc.event.dto.UserProfileUserDetails
import com.sc.event.repository.UserProfileRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class RegisterSecurityUserDetailService(
    val userProfileRepository: UserProfileRepository
) : UserDetailsService {

    val userNameRegex: Regex = "[0-9]*\\/.{2,}@.{2,}\\..{2,}".toRegex()

    override fun loadUserByUsername(userName: String?): UserDetails {

        if (userName == null || !userNameRegex.matches(userName)) throw UsernameNotFoundException("Invalid user name. $userName")
        val userNameParts = userName.split("/")
        val eventId: Long = userNameParts[0].trim().toLong()
        val email: String = userNameParts[1]

        return userProfileRepository.findByEventAndEmail(eventId, email)
            .map { userProfile ->  UserProfileUserDetails(userProfile, getRoles(eventId, email))}
            .orElseThrow { UsernameNotFoundException("Can not find user. eve$eventId $email") }
    }

    private fun getRoles(eventId: Long, email: String): List<String> =
        userProfileRepository.findRolesByEventAndEmail(eventId, email)
            .map { it.roleName }
}