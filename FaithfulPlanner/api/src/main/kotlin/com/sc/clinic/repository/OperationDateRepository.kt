package com.sc.clinic.repository

import com.sc.clinic.entity.OperationDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OperationDateRepository : JpaRepository<OperationDate, Long>

