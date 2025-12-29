package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.Company
import jakarta.validation.constraints.Size

data class CompanyDto(
    @JsonProperty("id")
    val id: Long?,
    @Size(min = 3, max = 250, message = "Company name should be between 3 and 250 characters long")
    @JsonProperty("companyName")
    val companyName: String,
    @JsonProperty("active")
    val active: Boolean?,
) {
    constructor(company: Company) : this(
        company.id, company.companyName, company.active
    )
}
