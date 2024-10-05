package org.event.register.repository

import org.event.register.entity.event.Event
import org.springframework.data.repository.CrudRepository

interface EventRepository : CrudRepository<Event, Long>