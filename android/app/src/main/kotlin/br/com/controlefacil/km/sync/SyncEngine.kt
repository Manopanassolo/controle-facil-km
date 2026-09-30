package br.com.controlefacil.km.sync

class SyncEngine(
    private val connectivity: SyncConnectivity
) {
    fun shouldSync(): Boolean = connectivity.isOnline()

    fun mergeDecision(
        localVersion: Int,
        remoteVersion: Int
    ): ConflictResolution = ConflictResolver.resolve(localVersion, remoteVersion)
}
