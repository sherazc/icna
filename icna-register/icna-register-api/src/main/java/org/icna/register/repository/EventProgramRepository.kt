package org.icna.register.repository

import org.icna.register.dto.EventProgramDto
import org.icna.register.entity.EventProgram
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface EventProgramRepository : CrudRepository<EventProgram, Long> {

    @Query("""
        select new org.icna.register.dto.EventProgramDto(ep.id, e.id, ep.programName) 
        from EventProgram ep
        join Event e on ep.event = e
        where e.id = :eventId
    """)
    fun findByEventIda(eventId: Long): List<EventProgramDto>
}