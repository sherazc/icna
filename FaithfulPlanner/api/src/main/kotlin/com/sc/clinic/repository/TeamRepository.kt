package com.sc.clinic.repository

import com.sc.clinic.entity.Team
import org.springframework.data.jpa.repository.JpaRepository

interface TeamRepository: JpaRepository<Team, Long> {
    fun findByCompanyId(companyId: Long): List<Team>
}