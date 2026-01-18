package com.sc.clinic.repository

import com.sc.clinic.entity.ClinicScheduleProvider
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClinicScheduleProviderRepository : JpaRepository<ClinicScheduleProvider, Long>

