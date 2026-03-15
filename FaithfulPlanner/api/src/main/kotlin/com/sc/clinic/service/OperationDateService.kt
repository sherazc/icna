package com.sc.clinic.service

import com.sc.clinic.dto.OperationDateDto
import com.sc.clinic.entity.OperationDate
import com.sc.clinic.exception.ScException
import com.sc.clinic.exception.ScGlobalExceptionHandler
import com.sc.clinic.repository.OperationDateRepository
import com.sc.clinic.util.DateUtils
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class OperationDateService(
    private val scheduleService: ScheduleService,
    private val operationRepository: OperationDateRepository,
    private val companyService: CompanyService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(ScGlobalExceptionHandler::class.java)
    }

    fun save(companyId: Long, operationDateDto: OperationDateDto): OperationDateDto {
        logger.debug("Saving OperationDate. CompanyId:${companyId}, OperationDate:${operationDateDto.serviceDateString}")

        val serviceDate: LocalDate = DateUtils.isoToDate(operationDateDto.serviceDateString)
            ?: throw ScException("Invalid operation date format: ${operationDateDto.serviceDateString}")

        val operationDate: OperationDate = if (operationDateDto.id != null) {
            val foundOperationDate: OperationDate = operationRepository.findById(operationDateDto.id!!)
                .orElseThrow { ScException("Failed to find Operation Date by Id: ${operationDateDto.id}") }
            foundOperationDate.serviceDate = serviceDate
            foundOperationDate.notes = operationDateDto.notes
            foundOperationDate
        } else {
            val company = companyService.findById(companyId)
            OperationDate(null, company, serviceDate, operationDateDto.notes)
        }

        val savedOperationDate = operationRepository.save(operationDate)
        logger.debug("Successfully saved OperationDate. Id:${operationDate.id}")
        return OperationDateDto(savedOperationDate)
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