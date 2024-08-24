package org.icna.register.controller

import org.icna.register.service.security.ScTokenGeneratorService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/login")
class LoginTokenController(private val scTokenGeneratorService: ScTokenGeneratorService) {

    @GetMapping("/token")
    @PreAuthorize("hasAuthority(T(org.icna.register.service.model.AuthRole).BASIC_USER)")
    fun token(authentication: Authentication) =
        scTokenGeneratorService.generateToken(authentication)
}