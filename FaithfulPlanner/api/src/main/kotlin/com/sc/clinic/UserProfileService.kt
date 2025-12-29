package com.sc.clinic

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.repository.CompanyRepository
import com.sc.clinic.repository.UserProfileRepository
import org.springframework.stereotype.Service

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository,
    private val companyService: CompanyService
) {

    fun getAllActive(companyId: Long): List<UserProfileDto> = userProfileRepository
        .findActive(companyId)
        .map {
            it.usersPassword = null
            it
        }

    fun saveUser(userProfileDto: UserProfileDto): UserProfileDto {
        val userProfileEntity = updateEntityWithDto(userProfileDto)
            ?: UserProfile(userProfileDto.id, userProfileDto.email, userProfileDto.usersPassword)

        return CompanyDto(companyRepository.save(companyEntity))
    }

    private fun updateEntityWithDto(userProfileDto: UserProfileDto): UserProfile? {
        return userProfileDto.id?.let { id ->
            userProfileRepository.findById(id)
                .map {
                    it.email = userProfileDto.email
                    it
                }
                .orElse(null)
        }
    }
}