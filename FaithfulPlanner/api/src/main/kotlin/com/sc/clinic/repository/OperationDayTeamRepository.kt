package com.sc.clinic.repository

import com.sc.clinic.entity.OperationDayTeam
import org.springframework.data.jpa.repository.JpaRepository

interface OperationDayTeamRepository: JpaRepository<OperationDayTeam, Long> {
}