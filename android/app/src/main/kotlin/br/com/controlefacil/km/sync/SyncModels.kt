package br.com.controlefacil.km.sync

import java.time.Instant

enum class SyncRecordState { CLEAN, PENDING, SYNCING, CONFLICT, ERROR }

data class SyncMetadata(
    val version: Int = 0,
    val updatedAt: Instant? = null,
    val deletedAt: Instant? = null,
    val state: SyncRecordState = SyncRecordState.PENDING
)

enum class ConflictResolution { KEEP_LOCAL, KEEP_REMOTE, MERGE_REQUIRED }

data class SyncConflict<T>(
    val local: T,
    val remote: T,
    val localVersion: Int,
    val remoteVersion: Int,
    val resolution: ConflictResolution
)

data class SyncResult(
    val uploaded: Int = 0,
    val downloaded: Int = 0,
    val conflicts: Int = 0,
    val errors: Int = 0
)
