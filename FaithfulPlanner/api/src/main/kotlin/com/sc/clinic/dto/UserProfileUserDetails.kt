package com.sc.clinic.dto

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class UserProfileUserDetails: UserDetails {

    override fun getAuthorities(): Collection<GrantedAuthority?>? {
        TODO("Not yet implemented")
    }

    override fun getPassword(): String? {
        TODO("Not yet implemented")
    }

    override fun getUsername(): String? {
        TODO("Not yet implemented")
    }
}