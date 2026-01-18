package com.sc.clinic.repository

import com.sc.clinic.entity.WorkerDateAvailability
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface WorkerDateAvailabilityRepository : JpaRepository<WorkerDateAvailability, Long>

