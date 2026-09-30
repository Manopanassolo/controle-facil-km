package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.model.Attachment
import br.com.controlefacil.km.core.model.AttachmentSyncState
import br.com.controlefacil.km.sync.AttachmentSyncPolicy
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AttachmentSyncRetryTest {
    private fun attachment(
        state: AttachmentSyncState = AttachmentSyncState.LOCAL_ONLY,
        storagePath: String? = null,
        error: String? = null
    ) = Attachment(
        id = "a1",
        expenseId = "e1",
        localUri = "file:///data/receipts/a1.pdf",
        storagePath = storagePath,
        originalFilename = "comprovante.pdf",
        mimeType = "application/pdf",
        fileSizeBytes = 1024,
        state = state,
        error = error
    )

    @Test
    fun uploadFailurePreservesLocalRecordAndMarksError() {
        val local = attachment()

        val uploading = AttachmentSyncPolicy.beforeUpload(local)
        val failed = AttachmentSyncPolicy.uploadFailed(uploading, "network error")

        assertEquals("file:///data/receipts/a1.pdf", failed.localUri)
        assertEquals(AttachmentSyncState.ERROR, failed.state)
        assertEquals("network error", failed.error)
        assertTrue(AttachmentSyncPolicy.shouldRetry(failed))
    }

    @Test
    fun failedUploadRemainsEligibleForNextAttempt() {
        val failed = attachment(
            state = AttachmentSyncState.ERROR,
            error = "timeout"
        )

        assertTrue(AttachmentSyncPolicy.shouldRetry(failed))

        val retrying = AttachmentSyncPolicy.beforeUpload(failed)

        assertEquals(AttachmentSyncState.UPLOADING, retrying.state)
        assertEquals("file:///data/receipts/a1.pdf", retrying.localUri)
        assertEquals(null, retrying.error)
    }

    @Test
    fun successfulRetryEndsSyncedAndClearsError() {
        val failed = attachment(
            state = AttachmentSyncState.ERROR,
            error = "temporary failure"
        )

        val retrying = AttachmentSyncPolicy.beforeUpload(failed)
        val uploading = AttachmentSyncPolicy.uploadSucceededPendingMetadata(
            retrying.copy(
                storagePath = "user-1/expense-1/a1.pdf",
                uploadedAt = "2026-09-30T18:00:00Z"
            )
        )
        val synced = AttachmentSyncPolicy.metadataSucceeded(
            uploading,
            "user-1/expense-1/a1.pdf",
            "2026-09-30T18:00:00Z"
        )

        assertEquals(AttachmentSyncState.SYNCED, synced.state)
        assertEquals("user-1/expense-1/a1.pdf", synced.storagePath)
        assertEquals(null, synced.error)
        assertFalse(AttachmentSyncPolicy.shouldRetry(synced))
        assertEquals("file:///data/receipts/a1.pdf", synced.localUri)
    }

    @Test
    fun metadataFailureKeepsStoragePathAndAllowsRetryWithoutLosingLocalFile() {
        val uploaded = attachment(
            state = AttachmentSyncState.UPLOADING,
            storagePath = "user-1/expense-1/a1.pdf"
        )

        val failed = AttachmentSyncPolicy.metadataFailed(
            uploaded,
            "user-1/expense-1/a1.pdf",
            "2026-09-30T18:00:00Z",
            "metadata error"
        )

        assertEquals(AttachmentSyncState.ERROR, failed.state)
        assertEquals("user-1/expense-1/a1.pdf", failed.storagePath)
        assertEquals("file:///data/receipts/a1.pdf", failed.localUri)
        assertTrue(AttachmentSyncPolicy.shouldRetry(failed))
    }
}
