package com.sc.clinic.service.model

enum class JwtClaim(val value: String) {
    roles("roles"),
    companyId("companyId"),
    userProfileId("userProfileId")
}
