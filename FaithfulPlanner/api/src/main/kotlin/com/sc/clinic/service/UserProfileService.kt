package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.dto.UserProfileEmployeeTypesDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.EmployeeType
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.exception.ScBadRequestException
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.UserProfileRepository
import com.sc.clinic.service.model.AuthRole
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository,
    private val userRoleService: UserRoleService,
    private val passwordEncoder: PasswordEncoder,
    private val employeeTypeService: EmployeeTypeService
) {

    fun getAllActive(companyId: Long): List<UserProfileDto> = userProfileRepository
        .findByCompanyId(companyId)
        .map {
            it.usersPassword = null
            it
        }


    fun saveRegistrationAdmin(company: Company, userProfileDto: UserProfileDto): UserProfile {
        validate(userProfileDto)
        val userProfileEntity = getOrCreateUserProfileEntity(company, userProfileDto)
        userRoleService.addRole(userProfileEntity, AuthRole.BASIC_USER)
        userRoleService.addRole(userProfileEntity, AuthRole.ADMIN)
        return userProfileRepository.save(userProfileEntity)
    }

    private fun validate(userProfileDto: UserProfileDto) {
        if (userProfileDto.companyId == null) throw ScException("Can not save User Profile. Company ID is not set.")
        if (userProfileDto.id == null && isUserExists(userProfileDto.companyId!!, userProfileDto.email))
            throw ScBadRequestException(
                "Can not save User Profile. ${userProfileDto.email} already exists in CompanyId ${userProfileDto.companyId}"
            )
    }

    fun isUserExists(companyId: Long, email: String): Boolean =
        findByCompanyIdAndEmail(companyId, email) != null

    fun findByCompanyIdAndEmail(companyId: Long, email: String): UserProfile? =
        userProfileRepository.findByCompanyIdAndEmail(companyId, email).firstOrNull()


    fun getOrCreateUserProfileEntity(company: Company, userProfileDto: UserProfileDto): UserProfile =
        updateEntityWithDto(userProfileDto)
            ?: UserProfile(
                null,
                userProfileDto.email,
                userProfileDto.usersPassword?.let { passwordEncoder.encode(it) },
                userProfileDto.firstName,
                userProfileDto.lastName,
                userProfileDto.phoneNumber,
                company,
                mutableSetOf(),
                mutableSetOf()
            )

    private fun updateEntityWithDto(userProfileDto: UserProfileDto): UserProfile? {
        return userProfileDto.id?.let { id ->
            userProfileRepository.findById(id)
                .map {
                    it.email = userProfileDto.email
                    it.firstName = userProfileDto.firstName
                    it.lastName = userProfileDto.lastName
                    it.phoneNumber = userProfileDto.phoneNumber
                    it
                }
                .orElse(null)
        }
    }

    fun findRolesByCompanyAndEmail(companyId: Long, email: String) =
        userProfileRepository.findRolesByCompanyAndEmail(companyId, email)

    fun findByCompanyIdAndEmployeeGroupId(companyId: Long, groupId: Long) =
        userProfileRepository.findByCompanyIdAndEmployeeGroupId(companyId, groupId)
            .map { toUserProfileEmployeeTypes(it) }
            .map { u -> {
                u.usersPassword = null
                u
            } }

    private fun toUserProfileEmployeeTypes(u: UserProfile): UserProfileEmployeeTypesDto =
        UserProfileEmployeeTypesDto(
            u,
            u.employeeTypes.map { et -> employeeTypeService.mapEntityToDto(et) })

}