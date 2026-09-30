package br.com.controlefacil.km.googlecalendar.unit

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SyncRecoveryTest {
    @Test
    fun http410RequiresFullSync() {
        val recovery = SyncRecoveryController("token-valid")

        val action = recovery.onHttp410()

        assertEquals(RecoveryAction.FULL_SYNC, action)
        assertNull(recovery.currentToken)
    }

    @Test
    fun http410ClearsInvalidToken() {
        val recovery = SyncRecoveryController("token-invalid")

        recovery.onHttp410()

        assertNull(recovery.currentToken)
    }

    @Test
    fun successfulFullSyncProducesNewSyncToken() {
        val recovery = SyncRecoveryController("token-invalid")

        recovery.onHttp410()
        recovery.completeFullSync("token-new")

        assertEquals("token-new", recovery.currentToken)
        assertFalse(recovery.fullSyncRequired)
    }

    @Test
    fun http410RecoveryDoesNotLoopAfterSuccessfulFullSync() {
        val recovery = SyncRecoveryController("token-invalid")

        recovery.onHttp410()
        recovery.completeFullSync("token-new")

        val next = recovery.nextRequest()

        assertEquals(RequestMode.INCREMENTAL, next)
        assertEquals("token-new", recovery.currentToken)
    }

    @Test
    fun validIncrementalSyncDoesNotTriggerFullSync() {
        val recovery = SyncRecoveryController("token-valid")

        val next = recovery.nextRequest()

        assertEquals(RequestMode.INCREMENTAL, next)
        assertFalse(recovery.fullSyncRequired)
    }

    @Test
    fun second410BeforeRecoveryRemainsControlled() {
        val recovery = SyncRecoveryController("token-invalid")

        assertEquals(RecoveryAction.FULL_SYNC, recovery.onHttp410())
        assertEquals(RecoveryAction.FULL_SYNC, recovery.onHttp410())
        assertTrue(recovery.fullSyncRequired)
    }
}

private enum class RecoveryAction {
    FULL_SYNC,
}

private enum class RequestMode {
    FULL,
    INCREMENTAL,
}

private class SyncRecoveryController(
    var currentToken: String?,
) {
    var fullSyncRequired: Boolean = currentToken == null
        private set

    fun onHttp410(): RecoveryAction {
        currentToken = null
        fullSyncRequired = true
        return RecoveryAction.FULL_SYNC
    }

    fun completeFullSync(newToken: String) {
        currentToken = newToken
        fullSyncRequired = false
    }

    fun nextRequest(): RequestMode =
        if (fullSyncRequired || currentToken.isNullOrBlank()) {
            RequestMode.FULL
        } else {
            RequestMode.INCREMENTAL
        }
}
