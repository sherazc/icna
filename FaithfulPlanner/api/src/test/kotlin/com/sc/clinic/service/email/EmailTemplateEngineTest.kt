package com.sc.clinic.service.email

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class EmailTemplateEngineTest {

    private val engine = EmailTemplateEngine(EmailConfig().emailTemplateEngine())

    @Test
    fun `renders email_verify with name and verify link`() {
        val html = engine.render(
            "email_verify",
            mapOf("name" to "Sheraz", "verify_link" to "https://faithfulplanner.com/verify?code=abc123"),
        )

        assertTrue(html.contains("Sheraz"))
        assertTrue(html.contains("https://faithfulplanner.com/verify?code=abc123"))
    }
}
