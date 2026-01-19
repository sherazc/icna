package com.sc.clinic.repository

import com.sc.clinic.entity.EmployeeAvailabilityPattern
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmployeeAvailabilityPatternRepository : JpaRepository<EmployeeAvailabilityPattern, Long>

