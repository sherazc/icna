package com.sc.clinic.repository

import com.sc.clinic.entity.WorkerType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface WorkerTypeRepository : JpaRepository<WorkerType, Long>

