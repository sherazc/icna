package com.sc.clinic.service

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.dto.RegistrationDto
import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.exception.ScBadRequestException
import jakarta.transaction.Transactional
import jakarta.validation.Valid
import org.springframework.stereotype.Service

@Service
class RegistrationSaveService(
    val companyService: CompanyService,
    val userProfileService: UserProfileService) {

    @Transactional
    fun saveNewRegistration(@Valid registrationDto: RegistrationDto): RegistrationDto {
        validate(registrationDto)

        // Save Company
        val companyEntity = companyService.saveCompany(registrationDto.company)
        // Save User
        val userProfileEntity = userProfileService.saveRegistrationAdmin(companyEntity, registrationDto.adminUser)

        // Build response
        return RegistrationDto(CompanyDto(companyEntity), UserProfileDto(userProfileEntity))
    }

    private fun validate(registrationDto: RegistrationDto) {
    }
}