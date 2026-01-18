package com.sc.clinic.repository

import com.sc.clinic.entity.ProviderType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProviderTypeRepository : JpaRepository<ProviderType, Long>

