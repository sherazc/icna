package com.sc.clinic.repository

import com.sc.clinic.dto.EmployeeGroupDto
import com.sc.clinic.entity.EmployeeGroup
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface EmployeeGroupRepository : JpaRepository<EmployeeGroup, Long> {
    fun countByCompanyId(companyId: Long): Long
    fun findByCompanyId(companyId: Long): List<EmployeeGroup>

    @Query(
        """
        SELECT new com.sc.clinic.dto.EmployeeGroupDto(eg.id, eg.groupName) 
        FROM EmployeeGroup eg 
        WHERE eg.company.id = :companyId
        order by eg.groupName """
    )
    fun findGroups(companyId: Long): List<EmployeeGroupDto>

    @Query(
        """
        SELECT new com.sc.clinic.dto.EmployeeGroupDto(eg.id, eg.groupName) 
        FROM EmployeeGroup eg 
        WHERE eg.id = :groupId """
    )
    fun findGroup(groupId: Long): EmployeeGroupDto?
}

