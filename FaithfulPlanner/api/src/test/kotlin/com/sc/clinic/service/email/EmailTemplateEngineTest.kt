package com.sc.clinic.service.email

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class EmailTemplateEngineTest {

    private val engine = EmailTemplateEngine(EmailConfig().emailThymeleafEngine())

    @Test
    fun `renders operation_day_create_user_notification with name date and sign up link`() {
        val signUpLink = "https://faithfulplanner.com/clinic/dashboard?opDayDetailSelectedId=1"
        val html = engine.render(
            "operation_day_create_user_notification",
            mapOf(
                "userProfileFirstName" to "Sheraz",
                "userProfileLastName" to "Tariq",
                "companyName" to "Shifa Clinic",
                "operationDayDisplayDate" to "Saturday, January 1, 2026",
                "signUpLink" to signUpLink,
                "baseUrl" to "https://faithfulplanner.com",
            ),
        )

        assertTrue(html.contains("Sheraz"))
        assertTrue(html.contains("Shifa Clinic"))
        assertTrue(html.contains("Saturday, January 1, 2026"))
        assertTrue(html.contains(signUpLink))
    }
}
