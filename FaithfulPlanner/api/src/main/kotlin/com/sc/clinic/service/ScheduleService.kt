package com.sc.clinic.service

import com.sc.clinic.dto.ScheduleDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.entity.Schedule
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.ScheduleRepository
import jakarta.persistence.EntityManager
import org.springframework.stereotype.Service

@Service
class ScheduleService(private val scheduleRepository: ScheduleRepository) {
    fun deleteUserAllSchedules(userProfileId: Long): Int = scheduleRepository.deleteUserAllSchedules(userProfileId)
    fun deleteOperationDayAllSchedules(operationDayId: Long): Int =
        scheduleRepository.deleteOperationDayAllSchedules(operationDayId)

    fun scheduleUser(schedule: ScheduleDto): Boolean {
        val exists = scheduleRepository.existsByOperationDay_IdAndUserProfile_Id(schedule.operationDayId, schedule.userProfileId)
        if (exists) {
            throw ScException("Failed to schedule. User is already scheduled. OperationDayId=${schedule.operationDayId}, UserProfileId=${schedule.userProfileId}")
        } else {

            scheduleRepository.scheduleUser(schedule.operationDayId, schedule.userProfileId);
            return true
        }
    }
}
