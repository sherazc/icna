package com.sc.clinic.service

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.entity.Company
import com.sc.clinic.exception.ScBadRequestException
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.CompanyRepository
import org.springframework.stereotype.Service

@Service
class CompanyService(private val companyRepository: CompanyRepository) {

    fun getAllActive(): List<CompanyDto> = companyRepository.findActive()

    fun saveCompany(companyDto: CompanyDto): Company {
        validate(companyDto)
        val companyEntity = getOrCreateCompanyEntity(companyDto)
        return companyRepository.save(companyEntity)
    }

    fun validate(company: CompanyDto) {
        if (company.id == null && isCompanyNameExists(company.companyName)) {
            throw ScBadRequestException("company.companyName", "Company name already exists. ${company.companyName}")
        }
    }

    fun getOrCreateCompanyEntity(companyDto: CompanyDto): Company = updateEntityWithDto(companyDto)
        ?: Company(companyDto.id, companyDto.companyName, companyDto.active)

    fun getCompany(companyId: Long?): Company {
        return companyId
            .takeIf { it != null }
            .let { companyRepository.findById(it!!).orElseThrow { throw ScException("Company do not exists $it") } }
    }

    private fun updateEntityWithDto(companyDto: CompanyDto): Company? {
        return companyDto.id?.let { id ->
            companyRepository.findById(id)
                .map {
                    it.companyName = companyDto.companyName
                    it.active = companyDto.active
                    it
                }
                .orElse(null)
        }
    }

    fun findCompanyByName(companyName: String): Company? = companyRepository
        .findByCompanyNameIgnoreCase(companyName).firstOrNull()

    fun isCompanyNameExists(companyName: String): Boolean = findCompanyByName(companyName) != null

    fun findById(companyId: Long): Company =
        companyRepository.findById(companyId).orElseThrow { ScException("companyId", "Company not found. $companyId") }
}