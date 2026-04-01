package com.sc.clinic.controller

import com.sc.clinic.dto.OperationDayDto
import com.sc.clinic.service.OperationDayService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/company/{companyId}/operation-day")
@RestController
class OperationDayController(private val operationDayService: OperationDayService) {

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @PostMapping
    fun save(
        @PathVariable companyId: Long,
        @RequestBody operationDayDto: OperationDayDto
    ) = operationDayService.save(companyId,operationDayDto)

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    @GetMapping
    fun getByCompanyId(@PathVariable companyId: Long) = operationDayService.getByCompanyId(companyId)

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).BASIC_USER)")
    @GetMapping("/search")
    fun getByDate(
        @PathVariable companyId: Long,
        @RequestParam(name = "date-string") dateString: String
    ) = operationDayService.getByDate(companyId,dateString)

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @DeleteMapping("/{operationDayId}")
    fun delete(
        @PathVariable companyId: Long,
        @PathVariable operationDayId: Long
    ) = operationDayService.delete(companyId,operationDayId)

    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @GetMapping("/{operationDayId}/schedule/user-profile/{userProfileId}")
    fun addUser(
        @PathVariable companyId: Long,
        @PathVariable operationDayId: Long,
        @PathVariable userProfileId: Long) {
        println(companyId)
        println(operationDayId)
        println(userProfileId)
        TODO()
    }

    // Could have done it in delete mapping.
    // But action(schedule/unschedule) in the endpoint seems better to me.
    @PreAuthorize("hasAnyAuthority(T(com.sc.clinic.service.model.AuthRole).ADMIN)")
    @GetMapping("/{operationDayId}/unschedule/user-profile/{userProfileId}")
    fun removeUser(
        @PathVariable companyId: Long,
        @PathVariable operationDayId: Long,
        @PathVariable userProfileId: Long) {
        println(companyId)
        println(operationDayId)
        println(userProfileId)
        TODO()
    }
}