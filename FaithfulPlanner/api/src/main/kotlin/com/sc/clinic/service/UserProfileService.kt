package com.sc.clinic.service

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.repository.UserProfileRepository
import com.sc.clinic.service.model.AuthRole
import org.springframework.stereotype.Service

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository,
    private val userRoleService: UserRoleService
) {

    fun getAllActive(companyId: Long): List<UserProfileDto> = userProfileRepository
        .findActive(companyId)
        .map {
            it.usersPassword = null
            it
        }


    fun saveRegistrationAdmin(company: Company, userProfileDto: UserProfileDto): UserProfile {
        val userProfileEntity = getOrCreateUserProfileEntity(company, userProfileDto)
        userRoleService.addRole(userProfileEntity, AuthRole.BASIC_USER)
        userRoleService.addRole(userProfileEntity, AuthRole.ADMIN)
        return userProfileRepository.save(userProfileEntity)
    }


    fun getOrCreateUserProfileEntity(company: Company, userProfileDto: UserProfileDto): UserProfile =
        updateEntityWithDto(userProfileDto)
            ?: UserProfile(
                null,
                userProfileDto.email,
                userProfileDto.usersPassword,
                company,
                mutableSetOf()
            )


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