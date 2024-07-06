package org.icna.register.repository

import org.icna.register.dto.AttendeeDto
import org.icna.register.entity.Attendee
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface AttendeeRepository : CrudRepository<Attendee, Long> {

    @Query("""select new org.icna.register.dto.AttendeeDto(
            a.id,
            r.id,
            e.id,
            e.eventName,
            a.firstName,
            a.lastName) 
        from Attendee a 
        join Registration r on a.registration = r 
        join Event e on r.event = e
        where e.id = :eventId 
        order by a.firstName, a.lastName
        """)
    fun findAttendeeByEventId(eventId: Long): List<AttendeeDto>
}