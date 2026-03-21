package com.sc.clinic.repository

import com.sc.clinic.entity.Company
import com.sc.clinic.entity.OperationDay
import jakarta.persistence.criteria.JoinType
import org.springframework.data.jpa.domain.Specification
import java.time.LocalDate

object OperationDaySpecification {

    fun ofCompany(companyId: Long): Specification<OperationDay> = { root, _, cb ->
        val companyJoin = root.join<OperationDay, Company>("company", JoinType.INNER)
        cb.equal(companyJoin.get<Long>("id"), companyId)
    }

    fun after(date: LocalDate?): Specification<OperationDay> = { root, _, cb ->
        date?.let { ld ->
            cb.greaterThan(root.get<LocalDate>("serviceDate"), ld)
        }
    }

    fun before(date: LocalDate?): Specification<OperationDay> = { root, _, cb ->
        date?.let { ld ->
            cb.lessThan(root.get<LocalDate>("serviceDate"), ld)
        }
    }
}