package com.sc.clinic.service

import com.sc.clinic.entity.Schedule
import com.sc.clinic.repository.ScheduleRepository
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service

@Service
class ScheduleService(private val scheduleRepository: ScheduleRepository) {
    fun deleteUserSchedule(userProfileId: Long): Int = scheduleRepository.deleteUserSchedule(userProfileId)
}
