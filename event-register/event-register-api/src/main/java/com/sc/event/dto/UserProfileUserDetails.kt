package com.sc.event.dto

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserProfileUserDetails(
    private val user: UserProfileDto,
    private val roles: Collection<String>
) : UserDetails {
    override fun getAuthorities(): Collection<GrantedAuthority> = roles
        .filter { it.isNotBlank() }
        .map { SimpleGrantedAuthority(it) }
    fun getEventId() = user.eventId
    fun getUserProfileId():Long = user.id!!

    // override fun getPassword(): String = user.userPassword!!
    override fun getPassword(): String = if (user.userPassword.isNullOrEmpty()) "" else user.userPassword!!
    override fun getUsername(): String = user.email
    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
}