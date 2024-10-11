package com.sc.event.repository

import com.sc.event.entity.event.Registration
import org.springframework.data.repository.CrudRepository

interface RegistrationRepository : CrudRepository<Registration, Long>