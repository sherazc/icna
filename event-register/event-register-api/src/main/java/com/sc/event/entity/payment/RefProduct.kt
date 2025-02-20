package com.sc.event.entity.payment

data class RefProduct(
    val productName: String,
    val defaultPriceCents: Int)

fun getDefaultRefProducts() = listOf(
    RefProduct("1 Person", 20),
    RefProduct("2 Person", 30),
    RefProduct("1 Group/Family", 50),
    RefProduct("Additional Group Person", 10)
)