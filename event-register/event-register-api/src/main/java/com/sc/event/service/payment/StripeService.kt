package com.sc.event.service.payment

import com.stripe.Stripe
import com.stripe.model.checkout.Session
import com.stripe.param.checkout.SessionCreateParams
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class StripeService(
    @Value("com.sc.event.payment.stripe.secret")
    private val secretKey: String) {

    fun createSessionUrl(): String {
//        Stripe.apiKey = secretKey
        Stripe.apiKey = "sk_test_51QsvaCQE93joYKro3S7OeUpIcDtKWULFOdpYNcwiJqRmCDHapPQs9PHnrh35x1oYJLWW0WZ0uMduysiTodz72sQD000ZLbv89H"

        val parameters = buildParameters()
        val session = Session.create(parameters)

        return session.url
    }

    private fun buildParameters(): SessionCreateParams {
        val lineItem = buildLineItem()

        val sessionParameters = SessionCreateParams.builder()
            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("https://mail.google.com/")
            .setCancelUrl("https://www.cnn.com/")
            .addLineItem(lineItem) // Could be called multiple times
            .build()
        return sessionParameters
    }

    private fun buildLineItem(): SessionCreateParams.LineItem {
        val priceData = buildPriceData()

        return SessionCreateParams.LineItem.builder()
            .setQuantity(1)
            .setPriceData(priceData)
            .build()
    }

    private fun buildPriceData(): SessionCreateParams.LineItem.PriceData {
        val productData = buildProductData()

        return SessionCreateParams.LineItem.PriceData.builder()
            .setCurrency("usd")
            .setUnitAmount((19.99 * 100).toLong()) // Convert to cents
            .setProductData(productData)
            .build()
    }

    private fun buildProductData(): SessionCreateParams.LineItem.PriceData.ProductData {
        return SessionCreateParams.LineItem.PriceData.ProductData.builder()
            .setName("Event Registration")
            .build()
    }
}