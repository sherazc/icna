package com.sc.clinic.repository

import com.sc.clinic.entity.EmployeeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmployeeTypeRepository : JpaRepository<EmployeeType, Long> {

    fun findByEmployeeGroupId(employeeGroupId: Long): List<EmployeeType>
}

