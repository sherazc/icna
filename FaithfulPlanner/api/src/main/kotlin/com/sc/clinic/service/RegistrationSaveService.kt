package com.sc.clinic.service

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.dto.RegistrationDto
import com.sc.clinic.dto.UserProfileDto
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class RegistrationSaveService(
    val companyService: CompanyService,
    val userProfileService: UserProfileService) {

    @Transactional
    fun saveNewRegistration(registrationDto: RegistrationDto): RegistrationDto {
        validate(registrationDto)

        // Save Company
        val companyEntity = companyService.saveCompany(registrationDto.company)
        // Save User
        registrationDto.userProfile.companyId = companyEntity.id

        // Build response
        val userProfile = userProfileService.saveRegistrationAdmin(companyEntity, registrationDto.userProfile)
        userProfile.usersPassword = null
        return RegistrationDto(CompanyDto(companyEntity), userProfile)
    }

    private fun validate(registrationDto: RegistrationDto) {
    }
}