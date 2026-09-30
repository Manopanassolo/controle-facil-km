package br.com.controlefacil.km.sync

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.auth.user.UserInfo

data class SyncBatch<T>(
    val remote: List<T>,
    val uploaded: Int,
    val remoteWins: List<T>,
    val conflicts: List<SyncConflict<T>>
)

class SupabaseSyncRepository(
    private val client: SupabaseClient,
    private val userProvider: () -> UserInfo? = { client.auth.currentUserOrNull() }
) : SyncRepository {

    override suspend fun sync(): Result<SyncResult> = runCatching {
        requireNotNull(userProvider()) { "Usuário não autenticado." }
        val remote = client.from("vehicles").select().decodeList<RemoteVehicle>()
        SyncResult(downloaded = remote.size)
    }

    suspend fun syncVehicles(local: List<RemoteVehicle>): Result<SyncBatch<RemoteVehicle>> =
        syncTable(local, { client.from("vehicles").select().decodeList<RemoteVehicle>() }) { rows ->
            if (rows.isNotEmpty()) client.from("vehicles").upsert(rows)
        }

    suspend fun syncTrips(local: List<RemoteTrip>): Result<SyncBatch<RemoteTrip>> =
        syncTable(local, { client.from("trips").select().decodeList<RemoteTrip>() }) { rows ->
            if (rows.isNotEmpty()) client.from("trips").upsert(rows)
        }

    suspend fun loadExpenseCategories(): Result<List<RemoteExpenseCategory>> = runCatching {
        requireNotNull(userProvider()) { "Usuário não autenticado." }
        client.from("expense_categories").select().decodeList<RemoteExpenseCategory>()
    }

    suspend fun upsertAttachments(local: List<RemoteAttachment>): Result<Int> = runCatching {
        requireNotNull(userProvider()) { "Usuário não autenticado." }
        if (local.isNotEmpty()) client.from("attachments").upsert(local)
        local.size
    }

    suspend fun syncExpenses(local: List<RemoteExpense>): Result<SyncBatch<RemoteExpense>> =
        syncTable(local, { client.from("expenses").select().decodeList<RemoteExpense>() }) { rows ->
            if (rows.isNotEmpty()) client.from("expenses").upsert(rows)
        }

    private suspend fun <T> syncTable(
        local: List<T>,
        remoteLoader: suspend () -> List<T>,
        uploader: suspend (List<T>) -> Unit
    ): Result<SyncBatch<T>> = runCatching {
        requireNotNull(userProvider()) { "Usuário não autenticado." }
        val remote = remoteLoader()
        val remoteById = remote.associateBy { idOf(it) }
        val upload = mutableListOf<T>()
        val remoteWins = mutableListOf<T>()
        val conflicts = mutableListOf<SyncConflict<T>>()

        local.forEach { localRow ->
            val remoteRow = remoteById[idOf(localRow)]
            if (remoteRow == null) {
                upload += localRow
            } else {
                when (ConflictResolver.resolve(versionOf(localRow), versionOf(remoteRow))) {
                    ConflictResolution.KEEP_LOCAL -> upload += localRow
                    ConflictResolution.KEEP_REMOTE -> remoteWins += remoteRow
                    ConflictResolution.MERGE_REQUIRED ->
                        if (localRow != remoteRow) {
                            conflicts += SyncConflict(localRow, remoteRow, versionOf(localRow), versionOf(remoteRow), ConflictResolution.MERGE_REQUIRED)
                        }
                }
            }
        }
        uploader(upload)
        SyncBatch(remote, upload.size, remoteWins, conflicts)
    }

    private fun idOf(value: Any): String = when (value) {
        is RemoteVehicle -> value.id
        is RemoteTrip -> value.id
        is RemoteExpense -> value.id
        is RemoteAttachment -> value.id
        else -> error("Tipo de sincronização não suportado")
    }

    private fun versionOf(value: Any): Int = when (value) {
        is RemoteVehicle -> value.version
        is RemoteTrip -> value.version
        is RemoteExpense -> value.version
        is RemoteAttachment -> value.version
        else -> error("Tipo de sincronização não suportado")
    }
}
