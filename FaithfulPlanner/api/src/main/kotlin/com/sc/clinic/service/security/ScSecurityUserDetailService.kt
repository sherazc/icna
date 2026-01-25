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

@Service
class ScSecurityUserDetailService(val userProfileService: UserProfileService) : UserDetailsService {
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

    private fun getRoles(companyId: Long, email: String): List<String>  {
        val userRolesInDb = userProfileService.findRolesByCompanyAndEmail(companyId, email).map { it.roleName }
        val roles: MutableSet<String> = HashSet(userRolesInDb)
        if (userRolesInDb.contains(AuthRole.MASTER.toString())) {
            AuthRole.entries.forEach { roles.add(it.toString()) }
        }

        if (userRolesInDb.contains(AuthRole.ADMIN.toString())) {
            roles.add(AuthRole.BASIC_USER.toString())
        }

        return ArrayList(roles)
    }

}