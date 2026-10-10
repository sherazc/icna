package com.sc.clinic.service.notification

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.service.UserProfileService
import com.sc.clinic.service.email.AsyncEmailService
import com.sc.clinic.service.model.JwtClaim
import com.sc.clinic.util.DateUtils
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class OperationDayCreateNotification(
    @param:Value($$"${fp.email.link.base.url}")
    private val baseUrl: String,
    private val asyncEmailService: AsyncEmailService,
    private val userProfileService: UserProfileService
) {
    companion object {
        private val logger = LoggerFactory.getLogger(javaClass)
    }

    fun sendNotification(operationDay: OperationDay) {
        val companyId = operationDay.company.id
        if (companyId == null) {
            logger.warn("Can not send email. Company ID is null for OperationDay ID: {}", operationDay.id)
            return
        }
        userProfileService.getAllActive(companyId).forEach { user -> sendUserNotification(operationDay, user) }

    }

    private fun sendUserNotification(operationDay: OperationDay, user: UserProfileDto) {
        val signUpLink = createSignUpLink(operationDay)
        val operationDayDisplayDate = DateUtils.dateToDisplayDate(operationDay.serviceDate)
        val operationDayDisplaySmall = DateUtils.dateToUsDate(operationDay.serviceDate)

        val attributes = mapOf(
            "userProfileFirstName" to (user.firstName ?: ""),
            "userProfileLastName" to (user.lastName ?: ""),
            "signUpLink" to signUpLink,
            "operationDayDisplayDate" to operationDayDisplayDate,
            "operationDayDisplaySmall" to operationDayDisplaySmall,
            "companyName" to operationDay.company.companyName
        )

        asyncEmailService.send(
            "Faithful Planner Admin <shifa@shifaatlanta.com>",
            user.email,
            "Date added - $operationDayDisplaySmall",
            "operation_day_create_user_notification",
            attributes
        )

    }

    private fun createSignUpLink(operationDay: OperationDay) =
        "${baseUrl}/${operationDay.company.slugName}/dashboard?opDayDetailSelectedId=${operationDay.id}"

}