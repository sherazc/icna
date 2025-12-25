package com.sc.clinic.controller

import com.sc.clinic.dto.AuthUserTokenDto
import com.sc.clinic.service.security.ScTokenGeneratorService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/login")
class LoginController (private val scTokenGeneratorService: ScTokenGeneratorService){

    @GetMapping("/token")
    // @PreAuthorize("hasAnyAuthority()")
    fun token(authentication: Authentication): AuthUserTokenDto
        = scTokenGeneratorService.generateToken(authentication)
}