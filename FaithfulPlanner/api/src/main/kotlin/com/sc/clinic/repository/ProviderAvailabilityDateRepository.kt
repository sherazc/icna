package com.sc.clinic.repository

import com.sc.clinic.entity.ProviderAvailabilityDate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProviderAvailabilityDateRepository : JpaRepository<ProviderAvailabilityDate, Long>

