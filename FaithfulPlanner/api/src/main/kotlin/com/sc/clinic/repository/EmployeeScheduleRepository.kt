package com.sc.clinic.repository

import com.sc.clinic.entity.EmployeeSchedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EmployeeScheduleRepository : JpaRepository<EmployeeSchedule, Long>



