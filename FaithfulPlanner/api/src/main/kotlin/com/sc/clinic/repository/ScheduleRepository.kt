package com.sc.clinic.repository

import com.sc.clinic.dto.ScheduleDto
import com.sc.clinic.entity.Schedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ScheduleRepository : JpaRepository<Schedule, Long> {

    @Modifying
    @Query("delete from Schedule s where s.userProfile.id = :userProfileId")
    fun deleteUserAllSchedules(userProfileId: Long): Int

    @Modifying
    @Query("delete from Schedule s where s.operationDay.id = :operationDayId")
    fun deleteOperationDayAllSchedules(operationDayId: Long): Int

    @Modifying
    @Query("""
        INSERT INTO schedule(operation_day_id, user_profile_id, team_id, employee_type_id, team_instance_no)
        VALUES (:operationDayId, :userProfileId, :teamId, :employeeTypeId, :teamInstanceNo)
    """, nativeQuery = true)
    fun scheduleUser(
        operationDayId: Long,
        userProfileId: Long,
        teamId: Long,
        employeeTypeId: Long,
        teamInstanceNo: Int
    ): Int

    @Query("""
        select count(s) from Schedule s
        where s.operationDay.id = :operationDayId
        and s.team.id = :teamId
        and s.teamInstanceNo = :teamInstanceNo
        and s.employeeType.id = :employeeTypeId""")
    fun countAssigned(
        operationDayId: Long,
        teamId: Long,
        teamInstanceNo: Int,
        employeeTypeId: Long
    ): Long

    @Modifying
    @Query("""
        DELETE FROM schedule
        WHERE operation_day_id = :operationDayId 
        AND user_profile_id = :userProfileId
    """, nativeQuery = true)
    fun unscheduleUser(operationDayId: Long, userProfileId: Long): Int

    @Query("""
        select 
        new com.sc.clinic.dto.ScheduleDto(s.id, s.operationDay.id, s.userProfile.id, s.team.id, s.employeeType.id, s.teamInstanceNo) 
        from Schedule s
        where s.operationDay.id = :operationDayId
        and s.userProfile.id = :userProfileId""")
    fun findByOperationAndUser(operationDayId: Long, userProfileId: Long): List<ScheduleDto>

    @Query("""
        select 
        new com.sc.clinic.dto.ScheduleDto(s.id, s.operationDay.id, s.userProfile.id, s.team.id, s.employeeType.id, s.teamInstanceNo) 
        from Schedule s
        where s.operationDay.id = :operationDayId""")
    fun findByOperation(operationDayId: Long): List<ScheduleDto>

    @Query("""
        select s from Schedule s
        where s.operationDay.id = :operationDayId
        and s.userProfile.id = :userProfileId""")
    fun findEntityByOperationAndUser(operationDayId: Long, userProfileId: Long): Schedule?
}
