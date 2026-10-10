package com.sc.clinic.service

import com.sc.clinic.dto.OperationDayDto
import com.sc.clinic.dto.OperationDayTeamDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.OperationDayRepository
import com.sc.clinic.service.email.AsyncEmailService
import com.sc.clinic.util.DateUtils
import jakarta.transaction.Transactional
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class OperationDayService(
    private val scheduleService: ScheduleService,
    private val operationDayRepository: OperationDayRepository,
    private val companyService: CompanyService,
    private val operationDayTeamService: OperationDayTeamService,
    private val asyncEmailService: AsyncEmailService
) {

    companion object {
        private val logger = LoggerFactory.getLogger(OperationDayService::class.java)
    }

    @Transactional
    fun save(companyId: Long, operationDayDto: OperationDayDto): OperationDayDto {
        logger.debug("Saving OperationDay. CompanyId:${companyId}, OperationDay:${operationDayDto.serviceDateString}")

        // Validate
        val serviceDate: LocalDate = DateUtils.isoToDate(operationDayDto.serviceDateString)
            ?: throw ScException("Invalid operation date format: ${operationDayDto.serviceDateString}")

        val existingOperationDays = operationDayRepository.findByCompanyIdAndOperationDay(companyId, serviceDate)
        if ( existingOperationDays.isNotEmpty() && operationDayDto.id != existingOperationDays.get(0).id) {
            throw ScException("Operation date already exists ${DateUtils.isoToUs(operationDayDto.serviceDateString)}")
        }

        // Create OperationDay Object
        val operationDayDtoId = operationDayDto.id
        val operationDay: OperationDay = if (operationDayDtoId != null) {
            val foundOperationDay: OperationDay = operationDayRepository.findById(operationDayDtoId)
                .orElseThrow { ScException("Failed to find Operation Date by Id: $operationDayDtoId") }
            foundOperationDay.serviceDate = serviceDate
            foundOperationDay.notes = operationDayDto.notes
            foundOperationDay
        } else {
            val company = companyService.findById(companyId)
            OperationDay(null, company, serviceDate, operationDayDto.notes)
        }

        // Save
        val savedOperationDay = operationDayRepository.save(operationDay)
        val savedOperationDayTeams = operationDayTeamService.save(savedOperationDay, operationDayDto.requiredOperationDayTeams)

        asyncEmailService.send(
            "Faithful Planner Admin <shifa@shifaatlanta.com>",
            "stariqch@gmail.com",
            "Event Created 5",
            "event_created_user_notification",
            mapOf("userProfileFirstName" to "Abrar"))

        // Convert response DTOs
        val savedOperationDayDto = OperationDayDto(savedOperationDay)
        savedOperationDayDto.requiredOperationDayTeams = savedOperationDayTeams.map { OperationDayTeamDto(it) }.toList()
        logger.debug("Successfully saved OperationDay. Id:${operationDay.id}")
        return savedOperationDayDto
    }

    fun getByDate(companyId: Long, dateString: String): List<OperationDayDto> {
        return DateUtils.isoToDate(dateString)
            ?.let { operationDayRepository.findByCompanyIdAndOperationDay(companyId, it) }
            ?: listOf()
    }

    @Transactional
    fun delete(companyId: Long, operationDayId: Long): Boolean {
        logger.info("Deleting Operation Date. OperationDayId = {}", operationDayId)
        val deletedSchedules = scheduleService.deleteOperationDayAllSchedules(operationDayId)
        logger.info("Deleted Operation {} schedules of operationDayId {}", deletedSchedules, operationDayId)
        val deletedByOperationDay = operationDayTeamService.deleteByOperationDayId(operationDayId)
        logger.info("Deleted Operation {} operation day team of operationDayId {}", deletedByOperationDay, operationDayId)
        operationDayRepository.deleteById(operationDayId)
        return true
    }

    fun getByCompanyId(companyId: Long): List<OperationDayDto> =
        operationDayRepository.getByCompanyId(companyId)
}