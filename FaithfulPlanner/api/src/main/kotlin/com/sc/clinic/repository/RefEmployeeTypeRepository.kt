package com.sc.clinic.repository

import com.sc.clinic.entity.RefEmployeeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RefEmployeeTypeRepository : JpaRepository<RefEmployeeType, Long>


