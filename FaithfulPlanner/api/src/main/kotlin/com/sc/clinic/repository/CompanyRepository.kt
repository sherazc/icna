package com.sc.clinic.repository

import com.sc.clinic.dto.CompanyDto
import com.sc.clinic.entity.Company
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface CompanyRepository : JpaRepository<Company, Long> {
    @Query("""
        select new com.sc.clinic.dto.CompanyDto(c.id, c.companyName, c.active) 
        from Company c
        where c.active = true """)
    fun findActive(): List<CompanyDto>

    fun findByCompanyNameIgnoreCase(companyName: String): List<Company>



    fun existsByCompanyName(companyName: String): Boolean
}

