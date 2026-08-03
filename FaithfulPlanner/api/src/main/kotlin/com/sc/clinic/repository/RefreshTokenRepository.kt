package com.sc.clinic.repository

import com.sc.clinic.entity.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface RefreshTokenRepository : JpaRepository<RefreshToken, Long> {
    fun findByTokenHash(tokenHash: String): RefreshToken?

    @Modifying
    @Query("delete from RefreshToken rt where rt.expiresAt < :expiredBefore or rt.revokedAt is not null")
    fun deleteExpiredOrRevoked(expiredBefore: LocalDateTime): Int
}
