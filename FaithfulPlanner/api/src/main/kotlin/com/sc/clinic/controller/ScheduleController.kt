package com.sc.clinic.controller

import com.sc.clinic.dto.ScheduleDto
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RequestMapping("/api/schedule")
@RestController
class ScheduleController() {

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @PostMapping
    fun scheduleUser(@RequestBody schedule: ScheduleDto) {
        println(schedule)
        TODO()
    }

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @DeleteMapping("/{operationDayId}/user-profile/{userProfileId}")
    fun unscheduleUser(@PathVariable operationDayId: Long, @PathVariable userProfileId: Long) {
        println(operationDayId)
        println(userProfileId)
        TODO()
    }
}