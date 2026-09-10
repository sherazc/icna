package com.sc.clinic.service.email

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.thymeleaf.TemplateEngine
import org.thymeleaf.spring6.SpringTemplateEngine
import org.thymeleaf.templatemode.TemplateMode
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.ses.SesClient

@Configuration
class EmailConfig {

    @Bean
    fun sesClient(@Value("\${aws.ses.region}") region: String): SesClient =
        SesClient.builder()
            .region(Region.of(region))
            .build()

    @Bean("emailThymeleafEngine")
    fun emailThymeleafEngine(): TemplateEngine {
        val resolver = ClassLoaderTemplateResolver().apply {
            prefix = "email_templates/"
            suffix = ".html"
            templateMode = TemplateMode.HTML
            characterEncoding = "UTF-8"
            isCacheable = true
        }
        return SpringTemplateEngine().apply { setTemplateResolver(resolver) }
    }
}
