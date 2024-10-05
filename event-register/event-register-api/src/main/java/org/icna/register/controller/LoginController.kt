package org.event.register.controller

import org.event.register.dto.AuthUserTokenDto
import org.event.register.service.security.ScTokenGeneratorService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/login")
class LoginController(private val scTokenGeneratorService: ScTokenGeneratorService) {

    @GetMapping("/token")
    @PreAuthorize("hasAuthority(T(org.event.register.service.model.AuthRole).BASIC_USER)")
    fun token(authentication: Authentication): AuthUserTokenDto = scTokenGeneratorService.generateToken(authentication)
}