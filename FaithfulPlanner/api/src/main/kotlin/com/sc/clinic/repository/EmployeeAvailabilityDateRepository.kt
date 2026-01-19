package com.sc.clinic.repository

import com.sc.clinic.entity.EmployeeAvailabilityDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmployeeAvailabilityDateRepository : JpaRepository<EmployeeAvailabilityDate, Long>

