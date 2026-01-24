package com.sc.clinic.repository

import com.sc.clinic.entity.Schedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ScheduleRepository : JpaRepository<Schedule, Long>

