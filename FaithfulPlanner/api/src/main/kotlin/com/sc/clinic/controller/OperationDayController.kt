package com.sc.clinic.controller

import com.sc.clinic.dto.OperationDayDto
import com.sc.clinic.service.OperationDayService
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
    @PostMapping
    fun save(
        @PathVariable companyId: Long,
        @RequestBody operationDayDto: OperationDayDto
    ) = operationDayService.save(companyId,operationDayDto)

    @GetMapping
    fun getByDate(
        @PathVariable companyId: Long,
        @RequestParam(name = "date-string") dateString: String
    ) = operationDayService.getByDate(companyId,dateString)

    @DeleteMapping("/{operationDayId}")
    fun delete(
        @PathVariable companyId: Long,
        @PathVariable operationDayId: Long
    ) = operationDayService.delete(companyId,operationDayId)
}