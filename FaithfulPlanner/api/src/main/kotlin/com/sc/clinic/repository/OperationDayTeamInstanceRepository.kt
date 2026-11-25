package com.sc.clinic.repository

import com.sc.clinic.entity.OperationDayTeamInstance
import com.sc.clinic.entity.OperationDayTeamInstanceId
import org.springframework.data.jpa.repository.JpaRepository

interface OperationDayTeamInstanceRepository : JpaRepository<OperationDayTeamInstance, OperationDayTeamInstanceId> {
    fun findByIdOperationDayIdAndIdTeamId(operationDayId: Long, teamId: Long): List<OperationDayTeamInstance>

    fun deleteByIdOperationDayId(operationDayId: Long): Long

    fun deleteByIdTeamId(teamId: Long): Long
}
