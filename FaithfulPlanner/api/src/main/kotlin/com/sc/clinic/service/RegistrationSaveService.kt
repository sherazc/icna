package com.sc.clinic.service

import com.sc.clinic.dto.RegistrationDto
import com.sc.clinic.exception.ScBadRequestException
import org.springframework.stereotype.Service

@Service
class RegistrationSaveService(
    val companyService: CompanyService,
    val userProfileService: UserProfileService) {
    fun saveNewRegistration(registrationDto: RegistrationDto): RegistrationDto {
        validate(registrationDto)

        // Save Company
        val companyEntity = companyService.saveCompany(registrationDto.company)
        // Save User
        val userProfileEntity = userProfileService.saveRegistrationUser(companyEntity, registrationDto.adminUser)


        TODO()
    }

    private fun validate(registrationDto: RegistrationDto) {
        if (companyService.isCompanyNameExists(registrationDto.company.companyName)) throw ScBadRequestException(
            "company.companyName", "Company name already exists. $registrationDto.company.companyName")
    }
}