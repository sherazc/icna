package org.event.register.repository

import org.event.register.dto.EventStyleDto
import org.event.register.entity.ui.Style
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface EventStyleRepository : CrudRepository<Style, Long> {
    @Query("""
        select new org.event.register.dto.EventStyleDto(
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