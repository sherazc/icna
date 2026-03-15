package com.sc.clinic.service

import com.sc.clinic.dto.OperationDayDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.exception.ScException
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.OperationDayRepository
import com.sc.clinic.util.DateUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class OperationDayService(
    private val scheduleService: ScheduleService,
    private val operationRepository: OperationDayRepository,
    private val companyService: CompanyService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    fun save(companyId: Long, operationDayDto: OperationDayDto): OperationDayDto {
        logger.debug("Saving OperationDay. CompanyId:${companyId}, OperationDay:${operationDayDto.serviceDateString}")

        val serviceDate: LocalDate = DateUtils.isoToDate(operationDayDto.serviceDateString)
            ?: throw ScException("Invalid operation date format: ${operationDayDto.serviceDateString}")

        val operationDay: OperationDay = if (operationDayDto.id != null) {
            val foundOperationDay: OperationDay = operationRepository.findById(operationDayDto.id!!)
                .orElseThrow { ScException("Failed to find Operation Date by Id: ${operationDayDto.id}") }
            foundOperationDay.serviceDate = serviceDate
            foundOperationDay.notes = operationDayDto.notes
            foundOperationDay
        } else {
            val company = companyService.findById(companyId)
            OperationDay(null, company, serviceDate, operationDayDto.notes)
        }

        val savedOperationDay = operationRepository.save(operationDay)
        logger.debug("Successfully saved OperationDay. Id:${operationDay.id}")
        return OperationDayDto(savedOperationDay)
    }

    fun getByDate(companyId: Long, dateString: String): List<OperationDayDto> {
        return DateUtils.isoToDate(dateString)
            ?.let { operationRepository.findByCompanyIdAndOperationDay(companyId, it) }
            ?: listOf()
    }

    fun delete(companyId: Long, operationDayId: Long): Boolean {
        logger.info("Deleting Operation Date. OperationDayId = {}", operationDayId)
        val deletedSchedules = scheduleService.deleteOperationDaySchedule(operationDayId)
        logger.info("Deleting Operation {} schedules of operationDayId {}", deletedSchedules, operationDayId)
        operationRepository.deleteById(operationDayId)
        return true
    }
}