package com.sc.clinic.controller

import com.sc.clinic.dto.RegistrationDto
import com.sc.clinic.service.RegistrationSaveService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/registration")
@RestController
class RegistrationController(val registrationSaveService: RegistrationSaveService) {

    @PutMapping
    fun saveRegistration(
        @Valid @RequestBody registration: RegistrationDto
    ): ResponseEntity<RegistrationDto> =
        ResponseEntity.ok(registrationSaveService.saveNewRegistration(registration))
}