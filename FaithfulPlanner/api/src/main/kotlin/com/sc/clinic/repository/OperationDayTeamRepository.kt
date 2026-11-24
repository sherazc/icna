package com.sc.clinic.repository

import com.sc.clinic.entity.OperationDayTeam
import jakarta.persistence.LockModeType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query

interface OperationDayTeamRepository: JpaRepository<OperationDayTeam, Long> {
    fun deleteByTeamId(teamId: Long): Long
    fun deleteByOperationDayId(operationDayId: Long): Long

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        select odt from OperationDayTeam odt
        where odt.operationDay.id = :operationDayId
        and odt.team.id = :teamId""")
    fun findForUpdate(operationDayId: Long, teamId: Long): OperationDayTeam?
}