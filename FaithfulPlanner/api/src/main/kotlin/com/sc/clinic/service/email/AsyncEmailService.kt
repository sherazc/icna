package com.sc.clinic.service.email

import org.springframework.stereotype.Service
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

@Service("asyncEmailService")
class AsyncEmailService(private val emailService: EmailService) : EmailService {

    private var executorService: ExecutorService? = null

    override fun send(
        from: String,
        to: String,
        subject: String,
        templateName: String,
        attributes: Map<String, String>
    ) {
        val executor = executorService?.takeUnless { it.isShutdown }
            ?: Executors.newCachedThreadPool().also { executorService = it }

        executor.submit {
            emailService.send(from, to, subject, templateName, attributes)
        }
    }
}
