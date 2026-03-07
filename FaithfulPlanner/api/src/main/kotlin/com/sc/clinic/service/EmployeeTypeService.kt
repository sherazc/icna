package com.sc.clinic.service

import com.sc.clinic.dto.EmployeeTypeDto
import com.sc.clinic.entity.EmployeeGroup
import com.sc.clinic.entity.EmployeeType
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.repository.EmployeeTypeRepository
import com.sc.clinic.repository.UserProfileRepository
import org.springframework.stereotype.Service

@Service
class EmployeeTypeService(
    private val employeeTypeRepository: EmployeeTypeRepository,
    private val userProfileRepository: UserProfileRepository,
) {

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

    fun deleteType(typeId: Long?) {
        typeId?.let {
            detachEmployeeType(typeId)
            employeeTypeRepository.deleteById(typeId)
        }
    }

    fun updateGroupTypes(group: EmployeeGroup, employeeTypes: List<EmployeeTypeDto>): List<EmployeeType> {
        val existingTypes: MutableList<EmployeeType> =
            group.id?.let { employeeTypeRepository.findByEmployeeGroupId(it).toMutableList() } ?: mutableListOf()

        for (type in employeeTypes) {
            val id: Long? = type.id?.let { id -> if (id < 1) null else id }

            val updatedType: EmployeeType = existingTypes.firstOrNull { et -> et.id?.equals(type.id) == true }
                ?.let { et ->
                    et.typeName = type.typeName
                    et
                }
                ?: run{
                    val newType = EmployeeType(id, type.typeName, group)
                    existingTypes.add(newType)
                    newType
                }

            employeeTypeRepository.save(updatedType)
        }

        return existingTypes
    }


    fun findByEmployeeType(typeId: Long): List<UserProfile> = userProfileRepository.findByEmployeeType(typeId)

    fun detachEmployeeType(typeId: Long) {
        findByEmployeeType(typeId).forEach { u ->
            u.employeeTypes.firstOrNull { et -> et.id == typeId }.let { et2 ->
                u.employeeTypes.remove(et2)
                userProfileRepository.save(u)
            }
        }
    }
}