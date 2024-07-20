package org.icna.register.repository

import org.icna.register.dto.EventStyleDto
import org.icna.register.entity.Style
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface EventStyleRepository : CrudRepository<Style, Long> {
    @Query("""
        select new org.icna.register.dto.EventStyleDto(
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