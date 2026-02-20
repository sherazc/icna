package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.entity.EmployeeType
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.repository.EmployeeTypeRepository
import org.springframework.stereotype.Service

@Service
class EmployeeTypeService(private val employeeTypeRepository: EmployeeTypeRepository) {

    fun findByEmployeeGroupId(employeeGroupId: Long) = employeeTypeRepository.findByEmployeeGroupIdOrderByTypeName(employeeGroupId)

    fun findDtoByEmployeeGroupId(employeeGroupId: Long) = findByEmployeeGroupId(employeeGroupId).map { mapEntityToDto(it) }


    fun mapEntityToDto(employeeType: EmployeeType) = EmployeeTypeDto(employeeType.id,employeeType.typeName)

    fun updateEmployeeTypes(userProfileEntity: UserProfile, userEmployeeTypes: List<EmployeeTypeDto>) {
        val employeeTypeIds = userEmployeeTypes.map { it.id }
        val employeeTypes =  employeeTypeRepository.findAllById(employeeTypeIds).toMutableSet()
        userProfileEntity.employeeTypes = employeeTypes
    }
}