package com.sc.event.service

import com.sc.event.dto.RegistrationDto
import com.sc.event.entity.event.Registration
import com.sc.event.mapper.RegistrationMapper
import com.sc.event.repository.RegistrationRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class RegistrationService(
    private val registrationMapper: RegistrationMapper,
    private val registrationRepository: RegistrationRepository,
    private val attendeeService: AttendeeService) {

    fun findByUserProfileId(userProfileId: Long) : Optional<RegistrationDto>
     = registrationRepository.getByUserProfileId(userProfileId)
         .flatMap { populateRegistrationDto(it) }


    fun findRegistration(registrationId: Long): Optional<RegistrationDto>
     =  registrationRepository.findById(registrationId)
         .flatMap { populateRegistrationDto(it) }

    private fun populateRegistrationDto(registration: Registration): Optional<RegistrationDto> {
        val registrationDto = registrationMapper.beanToDto(registration)
        registrationDto.attendees =
            attendeeService.findAttendeeByEventIdAndRegistrationId(registration.event.id!!, registration.id!!)
        return Optional.of(registrationDto)
    }
}

