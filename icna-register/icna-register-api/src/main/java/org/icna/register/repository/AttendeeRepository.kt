package org.icna.register.repository

import org.icna.register.dto.AttendeeDto
import org.icna.register.entity.event.Attendee
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.util.Optional

interface AttendeeRepository : CrudRepository<Attendee, Long> {

    @Query("""select new org.icna.register.dto.AttendeeDto(
            a.id,
            r.id,
            e.id,
            e.eventName,
            a.firstName,
            a.lastName, null) 
        from Attendee a 
        join Registration r on a.registration = r 
        join Event e on r.event = e
        where e.id = :eventId 
        order by r.id, a.firstName, a.lastName
        """)
    fun findAttendeeByEventId(eventId: Long): List<AttendeeDto>

    @Query("""select new org.icna.register.dto.AttendeeDto(
            a.id,
            a.registration.id,
            a.registration.event.id,
            a.registration.event.eventName,
            a.firstName,
            a.lastName, null) 
        from Attendee a
        where a.registration.event.id = :eventId and a.registration.id = :registrationId 
        order by a.firstName, a.lastName
        """)
    fun findAttendeeByEventIdAndRegistrationId(eventId: Long, registrationId: Long): List<AttendeeDto>


    @Query("""select new org.icna.register.dto.AttendeeDto(
            a.id,
            a.registration.id,
            a.registration.event.id,
            a.registration.event.eventName,
            a.firstName,
            a.lastName, null) 
        from Attendee a 
        where a.id = :attendeeId 
        """)
    fun findAttendeeByAttendeeId(attendeeId: Long): Optional<AttendeeDto>
}