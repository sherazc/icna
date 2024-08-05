package org.icna.register.repository

import org.icna.register.entity.event.Event
import org.springframework.data.repository.CrudRepository

interface EventRepository : CrudRepository<Event, Long>