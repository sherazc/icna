package com.sc.clinic.controller

import com.sc.clinic.dto.OpDayDetailDto
import com.sc.clinic.service.OpDayDetailService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/company/{companyId}/operation-day-detail")
@RestController
class OpDayDetailController(private val opDayDetailService: OpDayDetailService) {

    @GetMapping
    fun getAll(@PathVariable companyId: Long): List<OpDayDetailDto> = opDayDetailService.getAll(companyId)
}