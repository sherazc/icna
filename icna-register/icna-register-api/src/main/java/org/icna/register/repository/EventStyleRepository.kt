package org.icna.register.repository

import org.icna.register.dto.EventStyleDto
import org.icna.register.entity.EventStyle
import org.icna.register.entity.Registration
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface EventStyleRepository : CrudRepository<EventStyle, Long> {
    @Query("""
        select new org.icna.register.dto.EventStyleDto(
            es.id,
            es.event.id,
            es.type,
            es.name,
            es.value
        ) from EventStyle es
        where es.event.id = :eventId
        and es.type = 'VAR' 
        
    """)
    fun findVarByEventId(eventId: String): List<EventStyleDto>
}