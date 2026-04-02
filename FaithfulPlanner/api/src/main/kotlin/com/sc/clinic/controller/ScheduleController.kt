package com.sc.clinic.controller

import com.sc.clinic.dto.ScheduleDto
import com.sc.clinic.service.ScheduleService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RequestMapping("/api/schedule")
@RestController
class ScheduleController(private val scheduleService: ScheduleService) {

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @PostMapping
    fun scheduleUser(@RequestBody schedule: ScheduleDto) = scheduleService.scheduleUser(schedule)

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @DeleteMapping("/{operationDayId}/user-profile/{userProfileId}")
    fun unscheduleUser(@PathVariable operationDayId: Long, @PathVariable userProfileId: Long) =
        scheduleService.unscheduleUser(operationDayId, userProfileId)
}