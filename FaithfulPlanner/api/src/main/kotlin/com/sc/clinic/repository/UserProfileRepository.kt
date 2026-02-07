package com.sc.clinic.repository

import com.sc.clinic.dto.UserProfileDto
import com.sc.clinic.entity.UserProfile
import com.sc.clinic.entity.UserRole
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserProfileRepository : JpaRepository<UserProfile, Long> {

    @Query(
        """
        select u from UserProfile u
        where lower(u.email) = lower(:email) and u.company.id = :companyId""")
    fun findByCompanyIdAndEmail(companyId: Long, email: String): List<UserProfile>

    @Query(
        """
        select up.userRoles from UserProfile up
        where up.company.id = :companyId and lower(up.email) = lower(:email)""")
    fun findRolesByCompanyAndEmail(companyId: Long, email: String): List<UserRole>


    @Query(
        """
        select new com.sc.clinic.dto.UserProfileDto(u.id, u.email, u.userPassword, u.company.id, u.firstName, u.lastName, u.phoneNumber) 
        from UserProfile u
        where u.company.id = :companyId """)
    fun findByCompanyId(companyId: Long): List<UserProfileDto>


    @Query(
        """
        select u from UserProfile u 
        join u.employeeTypes et
        join et.employeeGroup eg
        where u.company.id = :companyId 
        and eg.id = :groupId
        order by u.firstName, u.lastName""")
    fun findByCompanyIdAndEmployeeGroupId(companyId: Long, groupId: Long): List<UserProfile>
}

