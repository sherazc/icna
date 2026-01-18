package com.sc.clinic.repository

import com.sc.clinic.entity.WorkerAvailabilityDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface WorkerAvailabilityDateRepository : JpaRepository<WorkerAvailabilityDate, Long>

