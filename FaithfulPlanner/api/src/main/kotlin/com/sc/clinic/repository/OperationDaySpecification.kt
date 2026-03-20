package com.sc.clinic.repository

import com.sc.clinic.entity.OperationDay
import org.springframework.data.jpa.domain.Specification
import java.time.LocalDate

object OperationDaySpecification {

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