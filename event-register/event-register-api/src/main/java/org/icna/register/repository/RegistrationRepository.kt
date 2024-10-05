package org.event.register.repository

import org.event.register.entity.event.Registration
import org.springframework.data.repository.CrudRepository

interface RegistrationRepository : CrudRepository<Registration, Long>