package com.sc.clinic.repository

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.UserProfile
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserProfileRepository : JpaRepository<UserProfile, Long> {

    @Query("""
        select new com.sc.clinic.dto.UserProfileDto(
            u.id, u.email, u.userPassword, u.company.id
        ) from UserProfile u
        where u.email = :email and u.company.id = :companyId
    """)
    fun findByCompanyIdAndEmail(companyId: Long, email: String): UserProfileDto?

}

