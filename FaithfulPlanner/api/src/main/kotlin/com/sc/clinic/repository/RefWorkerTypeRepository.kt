package com.sc.clinic.repository

import com.sc.clinic.entity.RefWorkerType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RefWorkerTypeRepository : JpaRepository<RefWorkerType, Long>

