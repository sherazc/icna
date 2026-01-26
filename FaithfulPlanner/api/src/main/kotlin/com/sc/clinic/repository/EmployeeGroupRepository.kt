package com.sc.clinic.repository

import com.sc.clinic.entity.Company
import com.sc.clinic.entity.EmployeeGroup
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface EmployeeGroupRepository : JpaRepository<EmployeeGroup, Long> {
    fun countByCompanyId(companyId: Long): Long
    fun findByCompanyId(companyId: Long): List<EmployeeGroup>
    fun company(company: Company): MutableList<EmployeeGroup>
    @Query("""
        SELECT eg.groupName FROM EmployeeGroup eg WHERE eg.company.id = :companyId
        order by eg.groupName
    """)
    fun findGroupNames(companyId: Long): List<String>

}

