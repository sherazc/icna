package org.icna.register.dto

import org.icna.register.entity.Event

data class RegistrationDto(
    val id: Long?,
    val event: Event?
)