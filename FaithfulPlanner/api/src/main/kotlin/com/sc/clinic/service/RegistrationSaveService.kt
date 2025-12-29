package com.sc.clinic.service

import com.sc.clinic.dto.RegistrationDto
import org.springframework.stereotype.Service

@Service
class RegistrationSaveService {
    fun save(registrationDto: RegistrationDto): RegistrationDto {



        TODO()
    }

    private fun validate(registrationDto: RegistrationDto) {

        userProfileService.validateEmail(eventId, registrationDto.userProfile)
    }
}