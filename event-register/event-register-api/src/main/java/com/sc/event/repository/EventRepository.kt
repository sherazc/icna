package com.sc.event.repository

import com.sc.event.entity.event.Event
import org.springframework.data.repository.CrudRepository
import java.time.LocalDateTime

interface EventRepository : CrudRepository<Event, Long> {
    fun findAllByActiveIsTrueAndStartDateAfterOrderByStartDate(startDate: LocalDateTime): List<Event>
}