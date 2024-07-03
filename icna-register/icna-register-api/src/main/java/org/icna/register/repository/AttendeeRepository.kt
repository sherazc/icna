package org.icna.register.repository

import org.icna.register.entity.Attendee
import org.springframework.data.repository.CrudRepository

interface AttendeeRepository : CrudRepository<Attendee, Long>