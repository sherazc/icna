package com.sc.clinic.repository

import com.sc.clinic.entity.Company
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface CompanyRepository : JpaRepository<Company, Long> {

    fun findByCompanyName(companyName: String): Optional<Company>

    fun findByActive(active: Boolean): List<Company>

    fun existsByCompanyName(companyName: String): Boolean
}

