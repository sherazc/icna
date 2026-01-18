package com.sc.clinic.repository

import com.sc.clinic.entity.ProviderDateAvailability
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProviderDateAvailabilityRepository : JpaRepository<ProviderDateAvailability, Long>

