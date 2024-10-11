package com.sc.event.repository

import com.sc.event.entity.event.Event
import org.springframework.data.repository.CrudRepository

interface EventRepository : CrudRepository<Event, Long>