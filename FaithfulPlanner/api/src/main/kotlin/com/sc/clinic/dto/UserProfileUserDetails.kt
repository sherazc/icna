package com.sc.clinic.dto

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

data class UserProfileUserDetails(
    var user: UserProfileDto,
    var roles: Collection<String>
) : UserDetails {

    fun getCompanyId() = user.companyId

    fun getUserProfileId() = user.id!!

    override fun getAuthorities(): Collection<GrantedAuthority> = roles
        .filter { it.isNotBlank() }
        .map { SimpleGrantedAuthority(it) }

    override fun getPassword(): String? = user.userPassword

    override fun getUsername(): String = user.email
}