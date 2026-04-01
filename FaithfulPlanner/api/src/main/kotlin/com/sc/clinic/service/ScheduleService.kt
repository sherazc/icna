package com.sc.clinic.service

import com.sc.clinic.repository.ScheduleRepository
import org.springframework.stereotype.Service

@Service
class ScheduleService(private val scheduleRepository: ScheduleRepository) {
    fun deleteUserAllSchedules(userProfileId: Long): Int = scheduleRepository.deleteUserAllSchedules(userProfileId)
    fun deleteOperationDayAllSchedules(operationDayId: Long): Int = scheduleRepository.deleteOperationDayAllSchedules(operationDayId)
}
