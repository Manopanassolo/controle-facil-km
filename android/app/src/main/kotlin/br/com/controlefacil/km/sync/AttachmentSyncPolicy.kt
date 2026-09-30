package br.com.controlefacil.km.sync

import br.com.controlefacil.km.core.model.Attachment
import br.com.controlefacil.km.core.model.AttachmentSyncState

object AttachmentSyncPolicy {
    fun beforeUpload(attachment: Attachment): Attachment =
        attachment.copy(state = AttachmentSyncState.UPLOADING, error = null)

    fun uploadFailed(attachment: Attachment, message: String): Attachment =
        attachment.copy(state = AttachmentSyncState.ERROR, error = message)

    fun uploadSucceededPendingMetadata(attachment: Attachment): Attachment =
        attachment.copy(state = AttachmentSyncState.UPLOADING, error = null)

    fun metadataFailed(attachment: Attachment, storagePath: String, uploadedAt: String?, message: String): Attachment =
        attachment.copy(
            state = AttachmentSyncState.ERROR,
            storagePath = storagePath,
            uploadedAt = uploadedAt,
            error = message
        )

    fun metadataSucceeded(attachment: Attachment, storagePath: String, uploadedAt: String?): Attachment =
        attachment.copy(
            state = AttachmentSyncState.SYNCED,
            storagePath = storagePath,
            uploadedAt = uploadedAt,
            error = null
        )

    fun shouldRetry(attachment: Attachment): Boolean =
        attachment.state == AttachmentSyncState.LOCAL_ONLY ||
            attachment.state == AttachmentSyncState.ERROR
}
