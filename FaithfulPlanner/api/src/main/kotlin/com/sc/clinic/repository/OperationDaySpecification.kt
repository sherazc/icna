package com.sc.clinic.repository

import com.sc.clinic.entity.Company
import com.sc.clinic.entity.OperationDay
import jakarta.persistence.criteria.Join
import jakarta.persistence.criteria.JoinType
import org.springframework.data.jpa.domain.Specification
import java.time.LocalDate

object OperationDaySpecification {

    fun ofCompany(companyId: Long): Specification<OperationDay> = {
        root, query, cb ->
            // root.fetch<OperationDay, Company>("company", JoinType.LEFT)
            val companyJoin = root.join<OperationDay, Company>("", JoinType.LEFT)
            cb.equal(companyJoin.get<Int>("company.id"), companyId)
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