package br.com.controlefacil.km.googlecalendar.unit

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.Instant

class OAuthStateTest {
    private val now = Instant.parse("2026-09-30T12:00:00Z")

    @Test
    fun acceptsValidState() {
        val state = OAuthStatePolicy(
            expectedHash = "hash-valid",
            expiresAt = now.plusSeconds(300),
            used = false,
        )

        assertTrue(state.isAcceptable("hash-valid", now))
    }

    @Test
    fun rejectsUnknownState() {
        val state = OAuthStatePolicy(
            expectedHash = "hash-valid",
            expiresAt = now.plusSeconds(300),
            used = false,
        )

        assertFalse(state.isAcceptable("hash-other", now))
    }

    @Test
    fun rejectsExpiredState() {
        val state = OAuthStatePolicy(
            expectedHash = "hash-valid",
            expiresAt = now.minusSeconds(1),
            used = false,
        )

        assertFalse(state.isAcceptable("hash-valid", now))
    }

    @Test
    fun rejectsAlreadyUsedState() {
        val state = OAuthStatePolicy(
            expectedHash = "hash-valid",
            expiresAt = now.plusSeconds(300),
            used = true,
        )

        assertFalse(state.isAcceptable("hash-valid", now))
    }

    @Test
    fun stateCanBeConsumedOnlyOnce() {
        val state = OAuthStatePolicy(
            expectedHash = "hash-valid",
            expiresAt = now.plusSeconds(300),
            used = false,
        )

        assertTrue(state.consume("hash-valid", now))
        assertFalse(state.consume("hash-valid", now))
    }
}

private data class OAuthStatePolicy(
    val expectedHash: String,
    val expiresAt: Instant,
    var used: Boolean,
) {
    fun isAcceptable(candidateHash: String, now: Instant): Boolean =
        !used && now.isBefore(expiresAt) && candidateHash == expectedHash

    fun consume(candidateHash: String, now: Instant): Boolean {
        if (!isAcceptable(candidateHash, now)) return false
        used = true
        return true
    }
}
