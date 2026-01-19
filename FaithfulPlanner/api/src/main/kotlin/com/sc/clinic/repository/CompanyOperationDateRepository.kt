package com.sc.clinic.repository

import com.sc.clinic.entity.CompanyOperationDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CompanyOperationDateRepository : JpaRepository<CompanyOperationDate, Long>

