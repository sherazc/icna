package com.sc.clinic.dto

import com.fasterxml.jackson.annotation.JsonProperty
import com.sc.clinic.entity.Company
import jakarta.validation.constraints.Size

data class CompanyDto(
    @param:JsonProperty("id")
    val id: Long?,
    @field:Size(min = 3, max = 250, message = "Company name should be between 3 and 250 characters long")
    @param:JsonProperty("companyName")
    val companyName: String,
    @param:JsonProperty("active")
    val active: Boolean?,
) {
    constructor(company: Company) : this(
        company.id, company.companyName, company.active
    )
}
