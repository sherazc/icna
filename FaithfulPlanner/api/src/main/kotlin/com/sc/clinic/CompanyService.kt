package com.sc.clinic

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.entity.Company
import com.sc.clinic.repository.CompanyRepository
import org.springframework.stereotype.Service

@Service
class CompanyService(private val companyRepository: CompanyRepository) {
    fun getAllActive(): List<CompanyDto> = companyRepository.findActive()
    fun saveCompany(company: CompanyDto): CompanyDto {
        val companyEntity = company.id
            ?.let { companyRepository.findById(it).orElse(null) }
            ?: Company(null, company.companyName, true)

        TODO("Not yet implemented")
    }
}