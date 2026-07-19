package com.sc.clinic.repository

import com.sc.clinic.entity.TeamEmployeeType
import org.springframework.data.jpa.repository.JpaRepository

interface TeamEmployeeTypeRepository: JpaRepository<TeamEmployeeType, Long> {
    fun deleteByTeamId(teamId: Long): Long // Returns Long instead of Int because JPA returns Long

    fun deleteByTeamIdAndEmployeeTypeId(teamId: Long, employeeTypeId: Long): Long
}