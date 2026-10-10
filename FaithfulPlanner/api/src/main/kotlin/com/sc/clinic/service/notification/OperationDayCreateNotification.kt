package com.sc.clinic.service.notification

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.OperationDay
import com.sc.clinic.service.UserProfileService
import com.sc.clinic.service.email.AsyncEmailService
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

        asyncEmailService.send(
            "Faithful Planner Admin <shifa@shifaatlanta.com>",
            "stariqch@gmail.com",
            "Event Created 5",
            "event_created_user_notification",
            mapOf("userProfileFirstName" to "Abrar")
        )
    }

    private fun sendUserNotification(operationDay: OperationDay, user: UserProfileDto) {
        // localhost:5173/alshifa/dashboard?opDayDetailSelectedId=2
        val signUpLink = createSignUpLink(operationDay)
        val attribute = mapOf<String, String>(
            "userProfileFirstName" to (user.firstName ?: ""),
            "userProfileLastName" to (user.lastName ?: ""),
            "signUpLink" to signUpLink
        )
        TODO("Not yet implemented")
    }

    private fun createSignUpLink(operationDay: OperationDay) =
        "${baseUrl}/${operationDay.company.slugName}/dashboard?opDayDetailSelectedId=${operationDay.id}"

}