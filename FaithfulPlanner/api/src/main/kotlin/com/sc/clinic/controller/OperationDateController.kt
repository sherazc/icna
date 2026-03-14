package com.sc.clinic.controller

import com.sc.clinic.dto.OperationDateDto
import com.sc.clinic.service.OperationDateService
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
        @RequestParam companyId: Long,
        @RequestBody operationDateDto: OperationDateDto
    ) = operationDateService.save(companyId,operationDateDto)
}