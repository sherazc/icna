package com.sc.clinic.service

import com.sc.clinic.dto.ScheduleDto
import com.sc.clinic.entity.Schedule
import com.sc.clinic.repository.ScheduleRepository
import org.springframework.stereotype.Service

@Service
class ScheduleService(private val scheduleRepository: ScheduleRepository) {
    fun deleteUserAllSchedules(userProfileId: Long): Int = scheduleRepository.deleteUserAllSchedules(userProfileId)
    fun deleteOperationDayAllSchedules(operationDayId: Long): Int = scheduleRepository.deleteOperationDayAllSchedules(operationDayId)

    fun addSchedule(operationDayId: Long, userProfileId: Long): ScheduleDto {
        Schedule(null, )
    }

    fun hasSchedule(operationDayId: Long, userProfileId: Long): Boolean
        = scheduleRepository.countByOperationDay_IdAndUserProfile_Id(operationDayId, userProfileId) > 0

}
