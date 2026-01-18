package com.sc.clinic.repository

import com.sc.clinic.entity.WorkerAvailabilityPattern
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface WorkerAvailabilityPatternRepository : JpaRepository<WorkerAvailabilityPattern, Long>

