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
        registrationDto.adminUser.companyId = companyEntity.id
        val userProfileEntity = userProfileService.saveRegistrationAdmin(companyEntity, registrationDto.adminUser)

        // Build response
        val adminUser = UserProfileDto(userProfileEntity)
        adminUser.usersPassword = null
        return RegistrationDto(CompanyDto(companyEntity), adminUser)
    }

    private fun validate(registrationDto: RegistrationDto) {
    }
}