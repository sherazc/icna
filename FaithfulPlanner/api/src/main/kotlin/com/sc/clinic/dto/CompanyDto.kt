package com.sc.clinic.dto

import com.sc.clinic.entity.Company
import jakarta.validation.constraints.Size

data class CompanyDto(
    var id: Long?,
    @field:Size(min = 3, max = 250, message = "Company name should be between 3 and 250 characters long")
    var companyName: String,
    var uiThemeId: Long?,
    var active: Boolean?,
) {
    constructor(company: Company) : this(
        company.id, company.companyName, company.uiThemeId, company.active)
}
