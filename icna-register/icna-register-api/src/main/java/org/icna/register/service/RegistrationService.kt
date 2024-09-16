package org.icna.register.service

import org.icna.register.dto.AttendeeDto
import org.icna.register.dto.RegistrationDto
import org.icna.register.entity.auth.UserProfile
import org.icna.register.entity.event.Attendee
import org.icna.register.entity.event.Event
import org.icna.register.entity.event.EventProgram
import org.icna.register.entity.event.Registration
import org.icna.register.exception.ErExceptionBadRequest
import org.icna.register.mapper.AttendeeMapper
import org.icna.register.mapper.EventProgramMapper
import org.icna.register.mapper.RegistrationMapper
import org.icna.register.repository.RegistrationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.Optional

@Service
class RegistrationService(
    private val eventProgramMapper: EventProgramMapper,
    private val registrationMapper: RegistrationMapper,
    private val registrationRepository: RegistrationRepository,
    private val eventService: EventService,
    private val attendeeService: AttendeeService,
    private val userProfileService: UserProfileService) {

    @Transactional
    fun save(eventId: Long, registrationDto: RegistrationDto): RegistrationDto {

        validate(eventId, registrationDto)

        val event: Event = eventService.getEventById(eventId)

        // Save registration & UserProfile
        val registration: Registration = createOrGetRegistration(registrationDto, event)

        // Save Attendee
        val savedAttendees = attendeeService.saveAttendees(registration, registrationDto.attendees)

        return buildResponse(registration, savedAttendees)

        // Build Response
        registrationDto.id = registration.id
        registrationDto.attendees = savedAttendees.map {
            val eventProgramDtoList = it.eventPrograms?.map {
                val eventProgramDto = eventProgramMapper.beanToDto(it)
                eventProgramDto.eventId = eventId
                eventProgramDto
            }
            AttendeeDto(it.id!!,
                registration.id!!,
                eventId,
                event.eventName,
                it.firstName,
                it.lastName,
                eventProgramDtoList)
        }

        return registrationDto
    }

    private fun createOrGetRegistration(registrationDto: RegistrationDto,
                             event: Event): Registration {
        val registration: Registration = if (registrationDto.id == null || registrationDto.id!! < 0) {
            val userProfileSaved = userProfileService.save(event, registrationDto.userProfile)
            val registrationNew = Registration(null, event, userProfileSaved)
            registrationRepository.save(registrationNew)
        } else {
            getById(registrationDto.id!!)
        }
        return registration
    }

    private fun validate(eventId: Long, registrationDto: RegistrationDto) {
        if (registrationDto.id != null && registrationDto.id!! < 0 && registrationDto.userProfile.id != null && registrationDto.userProfile.id!! > 0) {
            throw ErExceptionBadRequest("Failed to save registration. UserProfile already exists. UserProfile should not exist for new Registrations.")
        }

        userProfileService.validateEmail(eventId, registrationDto.userProfile)
    }


    private fun getById(registrationId: Long): Registration =
        registrationRepository.findById(registrationId).orElseThrow {
            ResponseStatusException(
                HttpStatus.NOT_FOUND, "Registration $registrationId not found")
        }

    fun findRegistration(registrationId: Long): Optional<RegistrationDto> {
        val registrationOptional = registrationRepository.findById(registrationId)
        if (registrationOptional.isEmpty) {
            return Optional.empty()
        }

        val registration = registrationOptional.get()

        val registrationDto = registrationMapper.beanToDto(registration)
        registrationDto.attendees =
            attendeeService.findAttendeeByEventIdAndRegistrationId(registration.event.id!!, registrationId)

        return Optional.of(registrationDto)
    }
}

