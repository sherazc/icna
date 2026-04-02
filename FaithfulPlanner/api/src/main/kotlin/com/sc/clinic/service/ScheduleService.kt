package com.sc.clinic.service

import com.sc.clinic.dto.ScheduleDto
import com.sc.clinic.exception.ScException
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.ScheduleRepository
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ScheduleService(private val scheduleRepository: ScheduleRepository) {

    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    fun deleteUserAllSchedules(userProfileId: Long): Int = scheduleRepository.deleteUserAllSchedules(userProfileId)
    fun deleteOperationDayAllSchedules(operationDayId: Long): Int =
        scheduleRepository.deleteOperationDayAllSchedules(operationDayId)

    @Transactional
    fun scheduleUser(schedule: ScheduleDto): ScheduleDto {
        val existingSchedules = scheduleRepository.findByOperationAndUser(schedule.operationDayId, schedule.userProfileId)
        if (existingSchedules.isEmpty()) {
            val createdRecordsCount = scheduleRepository.scheduleUser(schedule.operationDayId, schedule.userProfileId)
            val createdRecords = scheduleRepository.findByOperationAndUser(schedule.operationDayId, schedule.userProfileId)
            return if(createdRecordsCount > 0 && !createdRecords.isEmpty())
                createdRecords.get(0)
            else
                throw ScException("Failed Schedule User. OperationDayId=${schedule.operationDayId}, UserProfileId=${schedule.userProfileId}")
        } else {
            logger.warn("User already scheduled. OperationDayId=${schedule.operationDayId}, UserProfileId=${schedule.userProfileId}")
            return existingSchedules.get(0)
        }
    }
}
