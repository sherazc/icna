package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.Company

data class CompanyDto (
    @JsonProperty("id") val id: Long?,
    @JsonProperty("companyName") val companyName: String,
    @JsonProperty("active") val active: Boolean?,
) {
    constructor(company: Company): this(
        company.id, company.companyName, company.active)
}
