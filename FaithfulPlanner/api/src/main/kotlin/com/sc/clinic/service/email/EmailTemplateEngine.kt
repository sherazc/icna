package com.sc.clinic.service.email

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context

@Component
class EmailTemplateEngine(private val templateEngine: TemplateEngine) {
    fun render(templateName: String, attributes: Map<String, String>): String {
        val context = Context().apply { setVariables(attributes) }
        return templateEngine.process(templateName, context)
    }
}
