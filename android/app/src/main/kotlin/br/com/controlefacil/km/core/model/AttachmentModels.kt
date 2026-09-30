package br.com.controlefacil.km.core.model

enum class AttachmentSyncState { LOCAL_ONLY, UPLOADING, SYNCED, ERROR }

data class Attachment(
    val id: String,
    val expenseId: String? = null,
    val tripId: String? = null,
    val localUri: String,
    val storagePath: String? = null,
    val originalFilename: String,
    val mimeType: String,
    val fileSizeBytes: Long,
    val sha256: String? = null,
    val width: Int? = null,
    val height: Int? = null,
    val uploadedAt: String? = null,
    val state: AttachmentSyncState = AttachmentSyncState.LOCAL_ONLY,
    val error: String? = null
)
