package com.sc.clinic.repository

import com.sc.clinic.dto.OperationDayDto
import com.sc.clinic.entity.OperationDay
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface OperationDayRepository : JpaRepository<OperationDay, Long> {

    @Query(
        """
        select new com.sc.clinic.dto.OperationDayDto(od) 
        from OperationDay od 
        where od.company.id = :companyId
        and od.serviceDate = :serviceDate """
    )
    fun findByCompanyIdAndOperationDay(
        companyId: Long, serviceDate: LocalDate
    ): List<OperationDayDto>
}


