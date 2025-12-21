package com.sc.clinic.service.security

import com.sc.clinic.dto.AuthUserTokenDto
import org.apache.tomcat.util.net.openssl.ciphers.Authentication
import org.springframework.stereotype.Service

@Service
class ScTokenGeneratorService {

    fun generateToken(authentication: Authentication): AuthUserTokenDto? {

        return null;
    }
}