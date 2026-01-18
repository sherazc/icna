package com.sc.clinic.repository

import com.sc.clinic.entity.ClinicOperationDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClinicOperationDateRepository : JpaRepository<ClinicOperationDate, Long>

