package com.sc.clinic.repository

import com.sc.clinic.entity.ClinicScheduleWorker
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClinicScheduleWorkerRepository : JpaRepository<ClinicScheduleWorker, Long>

