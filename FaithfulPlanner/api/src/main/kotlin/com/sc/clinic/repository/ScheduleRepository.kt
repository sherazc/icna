package com.sc.clinic.repository

import com.sc.clinic.entity.Schedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface ScheduleRepository : JpaRepository<Schedule, Long> {
    @Modifying
    @Query("delete from Schedule s where s.userProfile.id = :userProfileId")
    fun deleteUserSchedule(userProfileId: Long): Int

    @Modifying
    @Query("delete from Schedule s where s.operationDate.id = :operationDateId")
    fun deleteOperationDateSchedule(operationDateId: Long): Int
}
