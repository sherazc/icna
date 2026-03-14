package com.sc.clinic.controller

import com.sc.clinic.dto.OperationDateDto
import com.sc.clinic.service.OperationDateService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/company/{companyId}/operation-date")
@RestController
class OperationDateController(private val operationDateService: OperationDateService) {
    @PostMapping
    fun save(
        @PathVariable companyId: Long,
        @RequestBody operationDateDto: OperationDateDto
    ) = operationDateService.save(companyId,operationDateDto)

    @GetMapping
    fun getByDate(
        @PathVariable companyId: Long,
        @RequestParam(name = "date-string") dateString: String
    ) = operationDateService.getByDate(companyId,dateString)

    @DeleteMapping("/{operationDateId}")
    fun delete(
        @PathVariable companyId: Long,
        @PathVariable operationDateId: Long
    ) = operationDateService.delete(companyId,operationDateId)
}