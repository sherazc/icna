package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.repository.EmployeeTypeRepository
import org.springframework.stereotype.Service

@Service
class EmployeeTypeService(private val employeeTypeRepository: EmployeeTypeRepository) {

    fun findByEmployeeGroupId(employeeGroupId: Long) =
        employeeTypeRepository.findByEmployeeGroupIdOrderByTypeName(employeeGroupId)

    fun findDtoByEmployeeGroupId(employeeGroupId: Long) =
        findByEmployeeGroupId(employeeGroupId).map { EmployeeTypeDto(it) }

    fun updateEmployeeTypes(userProfileEntity: UserProfile, userEmployeeTypes: List<EmployeeTypeDto>) {
        val employeeTypeIds = userEmployeeTypes
            .filter { it.id != null }
            .map { it.id!! }
        val employeeTypes = employeeTypeRepository.findAllById(employeeTypeIds).toMutableSet()
        userProfileEntity.employeeTypes = employeeTypes
    }
}