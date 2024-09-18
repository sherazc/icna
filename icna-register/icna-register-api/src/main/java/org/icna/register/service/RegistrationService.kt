package org.icna.register.service

import org.icna.register.dto.RegistrationDto
import org.icna.register.entity.auth.UserProfile
import org.icna.register.entity.event.Attendee
import org.icna.register.entity.event.Event
import org.icna.register.entity.event.Registration
import org.icna.register.exception.ErExceptionBadRequest
import org.icna.register.exception.ErExceptionNotFound
import org.icna.register.mapper.AttendeeMapper
import org.icna.register.mapper.RegistrationMapper
import org.icna.register.repository.RegistrationRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Optional

@Service
class RegistrationService(
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
        val userProfileSaved = userProfileService.save(event, registrationDto.userProfile)

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
                ErExceptionNotFound("Can not save User Profile. ${registrationDto.id} not found")
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

