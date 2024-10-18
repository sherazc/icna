package com.sc.event.controller

import com.sc.event.dto.RegistrationDto
import com.sc.event.service.RegistrationSaveService
import com.sc.event.service.RegistrationService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RequestMapping("/api/registrations")
@RestController
class RegistrationController(
    private val registrationService: RegistrationService,
    private val registrationSaveService: RegistrationSaveService) {

    @GetMapping("/user-profile/{userProfileId}")
    fun findByUserProfileId(@PathVariable userProfileId: Long): ResponseEntity<RegistrationDto> {
        val registration = registrationService.findByUserProfileId(userProfileId)
        return if (registration.isEmpty) ResponseEntity.notFound().build() else ResponseEntity.ok(registration.get())
    }

    @PostMapping("/eventId/{eventId}")
    fun saveRegistration(
        @PathVariable eventId: Long,
        @RequestBody registration: RegistrationDto): ResponseEntity<RegistrationDto> =
        ResponseEntity.ok(registrationSaveService.save(eventId, registration))


    @GetMapping("/{registrationId}")
    fun findRegistrationByRegistrationId(@PathVariable registrationId: Long): ResponseEntity<RegistrationDto> {
        val registration = registrationService.findRegistration(registrationId)
        return if (registration.isEmpty) ResponseEntity.notFound().build() else ResponseEntity.ok(registration.get())
    }

}