package com.sc.clinic.service

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.Company
import com.sc.clinic.entity.EmployeeGroup
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.exception.ScBadRequestException
import com.sc.clinic.exception.ScException
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.UserProfileRepository
import com.sc.clinic.service.model.AuthRole
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class UserProfileService(
    private val userProfileRepository: UserProfileRepository,
    private val userRoleService: UserRoleService,
    private val passwordEncoder: PasswordEncoder,
    private val employeeTypeService: EmployeeTypeService,
    private val employeeGroupService: EmployeeGroupService,
    val companyService: CompanyService,
    private val scheduleService: ScheduleService,
) {
    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    fun getAllActive(companyId: Long): List<UserProfileDto> = userProfileRepository
        .findByCompanyId(companyId)
        .map {
            it.userPassword = null
            it
        }

    fun saveRegistrationAdmin(company: Company, user: UserProfileDto): UserProfileDto {
        validate(user)
        val userProfileEntity = getOrCreateUserProfileEntity(company, null, user)
        userRoleService.addRole(userProfileEntity, AuthRole.BASIC_USER)
        userRoleService.addRole(userProfileEntity, AuthRole.ADMIN)
        employeeTypeService.updateEmployeeTypes(userProfileEntity, user.employeeTypesDto)
        val savedUser = userProfileRepository.save(userProfileEntity)
        return UserProfileDto(savedUser)
    }

    fun saveUserEmployee(
        companyId: Long, groupId: Long, user: UserProfileDto
    ): UserProfileDto {
        validate(user)
        val company: Company = companyService.findById(companyId)
        val group: EmployeeGroup? = employeeGroupService.getGroup(groupId)
        val userProfileEntity = getOrCreateUserProfileEntity(company, group, user)
        userRoleService.addRole(userProfileEntity, AuthRole.BASIC_USER)
        employeeTypeService.updateEmployeeTypes(userProfileEntity, user.employeeTypesDto)
        val savedUser = userProfileRepository.save(userProfileEntity)
        return UserProfileDto(savedUser)
    }

    private fun validate(userProfileDto: UserProfileDto) {
        if (userProfileDto.companyId == null) throw ScException("Can not save User Profile. Company ID is not set.")
        if (userProfileDto.id == null && isUserExists(userProfileDto.companyId!!, userProfileDto.email))
            throw ScBadRequestException("email", "${userProfileDto.email} already exists")
    }

    fun isUserExists(companyId: Long, email: String): Boolean =
        findByCompanyIdAndEmail(companyId, email) != null

    fun findByCompanyIdAndEmail(companyId: Long, email: String): UserProfile? =
        userProfileRepository.findByCompanyIdAndEmail(companyId, email).firstOrNull()

    fun getOrCreateUserProfileEntity(
        company: Company,
        group: EmployeeGroup?,
        userProfileDto: UserProfileDto
    ): UserProfile =
        updateEntityWithDto(userProfileDto)
            ?: UserProfile(
                null,
                userProfileDto.email,
                userProfileDto.userPassword?.let { passwordEncoder.encode(it) },
                userProfileDto.firstName,
                userProfileDto.lastName,
                userProfileDto.phoneNumber,
                company,
                group,
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

    fun findUserProfiles(companyId: Long, groupId: Long) =
        userProfileRepository.findByCompanyIdAndEmployeeGroupId(companyId, groupId)
            .map { UserProfileDto(it) }
            .map { u ->
                u.userPassword = null
                u
            }

    fun findGroupScheduledUsers(
        companyId: Long,
        groupId: Long,
        operationDayId: Long,
        scheduled: Boolean
    ): List<UserProfileDto> {
        return userProfileRepository.findGroupScheduledUsers(companyId, groupId, operationDayId, scheduled)
            .map { UserProfileDto(it) }
            .map { u ->
                u.userPassword = null
                u
            }
    }

    fun hasUserProfiles(companyId: Long, groupId: Long) =
        userProfileRepository.hasByCompanyIdAndEmployeeGroupId(companyId, groupId)

    @Transactional
    fun deleteUser(userProfileId: Long): Boolean {
        logger.debug("Deleting user. {}", userProfileId)
        val deleteCountSchedule = scheduleService.deleteUserAllSchedules(userProfileId)
        logger.info("Deleted schedules. UserProfileId={}, Deleted Count={}", userProfileId, deleteCountSchedule)

        userProfileRepository.findById(userProfileId).orElse(null)
            ?.let { up ->
                up.employeeTypes = mutableSetOf()
                up.userRoles = mutableSetOf()
                userProfileRepository.save(up)
                userProfileRepository.delete(up)
            }
        return true;
    }

    fun getUser(userId: Long): UserProfileDto? {
        val user = userProfileRepository.findById(userId).orElse(null)
        return if (user == null) null else {
            val userDto = UserProfileDto(user)
            userDto.userPassword = null
            userDto
        }
    }
}