package br.com.controlefacil.km.googlecalendar.unit

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class SyncTokenPolicyTest {
    @Test
    fun initialSyncDoesNotSendSyncToken() {
        val request = SyncRequestPolicy.forToken(null)

        assertNull(request.syncToken)
        assertEquals(SyncMode.FULL, request.mode)
    }

    @Test
    fun incrementalSyncUsesStoredSyncToken() {
        val request = SyncRequestPolicy.forToken("token-001")

        assertEquals("token-001", request.syncToken)
        assertEquals(SyncMode.INCREMENTAL, request.mode)
    }

    @Test
    fun successfulSyncReplacesPreviousSyncToken() {
        val store = SyncTokenStore("token-old")

        store.replaceAfterSuccessfulSync("token-new")

        assertEquals("token-new", store.value)
    }

    @Test
    fun calendarChangeClearsPreviousSyncToken() {
        val store = SyncTokenStore("token-old")

        store.clearForCalendarChange()

        assertNull(store.value)
    }

    @Test
    fun fullSyncAfter410StartsWithoutOldToken() {
        val store = SyncTokenStore("token-invalid")

        store.clearFor410Recovery()

        val request = SyncRequestPolicy.forToken(store.value)

        assertNull(request.syncToken)
        assertEquals(SyncMode.FULL, request.mode)
    }
}

private enum class SyncMode {
    FULL,
    INCREMENTAL,
}

private data class SyncRequestPolicy(
    val mode: SyncMode,
    val syncToken: String?,
) {
    companion object {
        fun forToken(token: String?): SyncRequestPolicy =
            if (token.isNullOrBlank()) {
                SyncRequestPolicy(SyncMode.FULL, null)
            } else {
                SyncRequestPolicy(SyncMode.INCREMENTAL, token)
            }
    }
}

private class SyncTokenStore(
    var value: String?,
) {
    fun replaceAfterSuccessfulSync(newToken: String) {
        value = newToken
    }

    fun clearForCalendarChange() {
        value = null
    }

    fun clearFor410Recovery() {
        value = null
    }
}
