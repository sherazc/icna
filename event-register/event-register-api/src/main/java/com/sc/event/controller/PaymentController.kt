package com.sc.event.controller

import com.sc.event.service.payment.StripeService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/payment")
@RestController
class PaymentController(private val paymentService: StripeService) {

    @PreAuthorize("permitAll()")
    @GetMapping("stripe")
    fun stripeSessionUrl(): ResponseEntity<String> = ResponseEntity.ok(paymentService.createSessionUrl())
}
