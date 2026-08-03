package com.sc.clinic.service.security

import com.sc.clinic.repository.RefreshTokenRepository
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class RefreshTokenCleanupService(private val refreshTokenRepository: RefreshTokenRepository) {

    companion object {
        private val logger = LoggerFactory.getLogger(RefreshTokenCleanupService::class.java)
    }

    @Scheduled(cron = "0 0 3 * * *") // daily at 3am
    @Transactional
    fun purgeStaleTokens() {
        val deletedCount = refreshTokenRepository.deleteExpiredOrRevoked(LocalDateTime.now())
        logger.info("Purged {} stale refresh tokens.", deletedCount)
    }
}
