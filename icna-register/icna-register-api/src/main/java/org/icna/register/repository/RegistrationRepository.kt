package org.icna.register.repository

import org.icna.register.entity.Registration
import org.springframework.data.repository.CrudRepository

interface RegistrationRepository : CrudRepository<Registration, Long>