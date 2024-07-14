package org.icna.register.repository

import org.icna.register.dto.EventProgramDto
import org.icna.register.entity.EventProgram
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.*

interface EventProgramRepository : CrudRepository<EventProgram, Long> {

    @Query("""
        select new org.icna.register.dto.EventProgramDto(ep.id, ep.event.id, ep.programName) 
        from EventProgram ep
        where ep.event.id = :eventId
    """)
    fun findByEventId(eventId: Long): List<EventProgramDto>

    @Query("""
        select new org.icna.register.dto.EventProgramDto(ep.id, ep.event.id, ep.programName)
        from Attendee a 
        join a.eventPrograms ep
        where a.id = :attendeeId
    """)
    fun findByAttendeeId(attendeeId: Long): List<EventProgramDto>


    @Query("""
        select ep
        from Attendee a 
        join a.eventPrograms ep
        where a.id = :attendeeId
        and ep.id = :eventProgramId
    """)
    fun findByIdAndAttendeeId(eventProgramId: Long, attendeeId: Long): Optional<EventProgram>
}