package org.icna.register.service.security

import org.icna.register.dto.UserProfileUserDetails
import org.icna.register.entity.auth.UserRole
import org.icna.register.repository.UserProfileRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import java.util.Collections
import java.util.Optional

@Service
class RegisterSecurityUserDetailService(
    val userProfileRepository: UserProfileRepository
) : UserDetailsService {

    override fun loadUserByUsername(email: String?): UserDetails {
        if (email == null) throw UsernameNotFoundException("Email is null")

        return userProfileRepository.findByEmailIgnoreCase(email)
            .map { userProfile -> UserProfileUserDetails(userProfile, getRoleNames(userProfile.userRoles)) }
            .orElseThrow { UsernameNotFoundException("Can not find user: $email") }
    }

    private fun getRoleNames(userRoles: MutableSet<UserRole>?): Collection<String>
        = userRoles?.map { role -> role.roleName } ?: Collections.emptyList()
}