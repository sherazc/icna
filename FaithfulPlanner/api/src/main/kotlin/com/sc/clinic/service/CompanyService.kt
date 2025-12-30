package com.sc.clinic.service

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.entity.Company
import com.sc.clinic.exception.ScException
import com.sc.clinic.repository.CompanyRepository
import org.springframework.stereotype.Service

@Service
class CompanyService(private val companyRepository: CompanyRepository) {

    fun getAllActive(): List<CompanyDto> = companyRepository.findActive()

    fun saveCompany(companyDto: CompanyDto): Company {
        val companyEntity = getOrCreateCompanyEntity(companyDto)
        return companyRepository.save(companyEntity)
    }

    fun getOrCreateCompanyEntity(companyDto: CompanyDto): Company = updateEntityWithDto(companyDto)
        ?: Company(companyDto.id, companyDto.companyName, companyDto.active)

    fun getCompany(companyId: Long?): Company {
        return companyId
            .takeIf { it != null }
            .let { companyRepository.findById(it).orElseThrow { throw ScException("Company do not exists $it") } }
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

    fun isCompanyNameExists(companyName: String): Boolean {
        TODO("Not yet implemented")
    }
}