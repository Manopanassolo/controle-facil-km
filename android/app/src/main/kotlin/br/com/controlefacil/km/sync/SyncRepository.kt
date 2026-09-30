package br.com.controlefacil.km.sync

interface SyncRepository {
    suspend fun sync(): Result<SyncResult>
}
