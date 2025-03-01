package com.sc.event.service

import com.sc.event.dto.RegistrationDto
import com.sc.event.entity.auth.UserProfile
import com.sc.event.entity.event.Attendee
import com.sc.event.entity.event.Event
import com.sc.event.entity.event.Registration
import com.sc.event.exception.ErExceptionBadRequest
import com.sc.event.exception.ErExceptionNotFound
import com.sc.event.mapper.AttendeeMapper
import com.sc.event.mapper.RegistrationMapper
import com.sc.event.repository.RegistrationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

@Service
class RegistrationSaveService(
    private val registrationMapper: RegistrationMapper,
    private val attendeeMapper: AttendeeMapper,
    private val registrationRepository: RegistrationRepository,
    private val eventService: EventService,
    private val attendeeService: AttendeeService,
    private val userProfileService: UserProfileService) {

    @Transactional
    fun save(eventId: Long, registrationDto: RegistrationDto): RegistrationDto {

        validate(eventId, registrationDto)

        val event: Event = eventService.getEventById(eventId)

        // Save UserProfile
        val userProfileSaved = userProfileService.saveRegistrationUser(event, registrationDto.userProfile)

        // Save registration
        val registration: Registration = saveRegistration(event, registrationDto, userProfileSaved)

        // Save Attendee
        val savedAttendees = attendeeService.saveAttendees(registration, registrationDto.attendees)

        // Build response from the saved entities.
        return buildResponse(registration, savedAttendees)
    }

    private fun buildResponse(registration: Registration, attendee: List<Attendee>): RegistrationDto {
        val registrationDto = registrationMapper.beanToDto(registration)
        registrationDto.attendees = attendee.map { attendeeMapper.beanToDto(it) }
        return registrationDto
    }

    private fun saveRegistration(event: Event,
                                 registrationDto: RegistrationDto,
                                 userProfile: UserProfile): Registration {

        val registration: Registration = if (registrationDto.id == null || registrationDto.id!! < 0) {
            Registration(null, event, userProfile)
        } else {
            val r = registrationRepository.findById(registrationDto.id!!).orElseThrow {
                ErExceptionNotFound("Can not save registration. registrationId=${registrationDto.id} not found")
            }
            r.userProfile = userProfile;
            r
        }
        return registrationRepository.save(registration)
    }

    private fun validate(eventId: Long, registrationDto: RegistrationDto) {
        if (registrationDto.id != null && registrationDto.id!! < 0 && registrationDto.userProfile.id != null && registrationDto.userProfile.id!! > 0) {
            throw ErExceptionBadRequest("Failed to save registration. UserProfile already exists. UserProfile should not exist for new Registrations.")
        }

        userProfileService.validateEmail(eventId, registrationDto.userProfile)
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

