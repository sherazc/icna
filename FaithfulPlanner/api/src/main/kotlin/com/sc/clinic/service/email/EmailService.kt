package com.sc.clinic.service.email

interface EmailService {
    fun send(from: String, to: String, subject: String, templateName: String, attributes: Map<String, String>)
}
