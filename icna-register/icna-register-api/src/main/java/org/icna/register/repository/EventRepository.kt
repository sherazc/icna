package org.icna.register.repository

import org.icna.register.entity.Event
import org.springframework.data.repository.CrudRepository

interface EventRepository : CrudRepository<Event, Long>