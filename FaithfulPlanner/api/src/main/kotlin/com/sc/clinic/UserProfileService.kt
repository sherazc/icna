package com.sc.clinic

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.Company
import com.sc.clinic.repository.CompanyRepository
import com.sc.clinic.repository.UserProfileRepository
import org.springframework.stereotype.Service

@Service
class UserProfileService(private val userProfileRepository: UserProfileRepository) {

    fun getAllActive(companyId: Long): List<UserProfileDto> = userProfileRepository
        .findActive(companyId)
        .map {
            it.usersPassword = null
            it }
//
//    fun saveCompany(companyDto: CompanyDto): CompanyDto {
//        val companyEntity = updateEntityWithDto(companyDto)
//            ?: Company(companyDto.id, companyDto.companyName, companyDto.active)
//
//        return CompanyDto(companyRepository.save(companyEntity))
//    }
//
//    private fun updateEntityWithDto(companyDto: CompanyDto): Company? {
//        return companyDto.id?.let { id ->
//            companyRepository.findById(id)
//                .map {
//                    it.companyName = companyDto.companyName
//                    it.active = companyDto.active
//                    it
//                }
//                .orElse(null)
//        }
//    }
}