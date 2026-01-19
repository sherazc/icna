package com.sc.clinic.repository

import com.sc.clinic.entity.ClinicScheduleEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClinicScheduleEmployeeRepository : JpaRepository<ClinicScheduleEmployee, Long>


