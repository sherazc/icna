package com.sc.event.repository

import com.sc.event.entity.ui.Style
import com.sc.event.service.model.StyleVariable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface EventStyleRepository : CrudRepository<Style, Long> {
    @Query("""
        select new com.sc.event.service.model.StyleVariable(
            es.id,
            es.styleName,
            es.styleValue,
            es.styleType
        ) from Style es
        where es.event.id = :eventId
        and es.styleType in (
            com.sc.event.entity.ui.StyleType.VAR_COLOR,
            com.sc.event.entity.ui.StyleType.VAR_SIZE,
            com.sc.event.entity.ui.StyleType.VAR_STRING)
    """)
    fun findVarByEventId(eventId: Long): List<StyleVariable>
}