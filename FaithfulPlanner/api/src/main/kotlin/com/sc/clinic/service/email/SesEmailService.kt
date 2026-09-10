package com.sc.clinic.service.email

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import software.amazon.awssdk.services.ses.SesClient
import software.amazon.awssdk.services.ses.model.Body
import software.amazon.awssdk.services.ses.model.Content
import software.amazon.awssdk.services.ses.model.Destination
import software.amazon.awssdk.services.ses.model.Message
import software.amazon.awssdk.services.ses.model.SendEmailRequest

@Service("emailService")
class SesEmailService(
    private val sesClient: SesClient,
    private val templateEngine: EmailTemplateEngine,
) : EmailService {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun send(
        from: String,
        to: String,
        subject: String,
        templateName: String,
        attributes: Map<String, String>
    ) {
        try {
            val body = templateEngine.render(templateName, attributes)
            val request = SendEmailRequest.builder()
                .source(from)
                .destination(Destination.builder().toAddresses(to).build())
                .message(
                    Message.builder()
                        .subject(content(subject))
                        .body(Body.builder().html(content(body)).build())
                        .build()
                )
                .build()

            log.debug("Sending email from {} to {}", from, to)
            sesClient.sendEmail(request)
            log.debug("Email sent to {}", to)
        } catch (e: Exception) {
            log.error("Error sending email to {}", to, e)
        }
    }

    private fun content(data: String): Content =
        Content.builder().charset("UTF-8").data(data).build()
}
