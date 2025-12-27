package com.sc.clinic

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.entity.Company
import com.sc.clinic.repository.CompanyRepository
import org.springframework.stereotype.Service

@Service
class CompanyService(private val companyRepository: CompanyRepository) {

    fun getAllActive(): List<CompanyDto> = companyRepository.findActive()

    fun saveCompany(companyDto: CompanyDto): CompanyDto {
        val companyEntity = updateEntityWithDto(companyDto)
            ?: Company(null, companyDto.companyName, companyDto.active)

        return CompanyDto(companyRepository.save(companyEntity))
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
}