package com.sc.event.repository

import com.sc.event.dto.EventStyleDto
import com.sc.event.entity.ui.Style
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface EventStyleRepository : CrudRepository<Style, Long> {
    @Query("""
        select new com.sc.event.dto.EventStyleDto(
            es.id,
            es.event.id,
            es.styleType,
            es.styleName,
            es.styleValue
        ) from Style es
        where es.event.id = :eventId
        and es.styleType = 0
    """)
    fun findVarByEventId(eventId: Long): List<EventStyleDto>
}