package com.sc.clinic.service

import com.sc.clinic.dto.OperationDateDto
import com.sc.clinic.entity.OperationDate
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.OperationDateRepository
import com.sc.clinic.util.DateUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class OperationDateService(
    private val scheduleService: ScheduleService,
    private val operationRepository: OperationDateRepository
) {

    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    fun save(companyId: Long, operationDateDto: OperationDateDto): OperationDateDto {
        operationDateDto.id?.let { operationRepository.findById() }
        println(companyId)
        TODO()
    }

    fun getByDate(companyId: Long, dateString: String): List<OperationDateDto> {
        return DateUtils.isoToDate(dateString)
            ?.let { operationRepository.findByCompanyIdAndOperationDate(companyId, it) }
            ?: listOf()
    }

    fun delete(companyId: Long, operationDateId: Long): Boolean {
        logger.info("Deleting Operation Date. OperationDateId = {}", operationDateId)
        val deletedSchedules = scheduleService.deleteOperationDateSchedule(operationDateId)
        logger.info("Deleting Operation {} schedules of operationDateId {}", deletedSchedules, operationDateId)
        operationRepository.deleteById(operationDateId)
        return true
    }
}