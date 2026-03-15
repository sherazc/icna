package com.sc.clinic.repository

import com.sc.clinic.dto.OperationDateDto
import com.sc.clinic.entity.OperationDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDate

@Repository
interface OperationDateRepository : JpaRepository<OperationDate, Long> {

    @Query(
        """
        select new com.sc.clinic.dto.OperationDateDto(od) 
        from OperationDate od 
        where od.company.id = :companyId
        and od.operationDate = :operationDate """
    )
    fun findByCompanyIdAndOperationDate(
        companyId: Long, operationDate: LocalDate
    ): List<OperationDateDto>
}


