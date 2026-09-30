package br.com.controlefacil.km.sync

object ConflictResolver {
    fun resolve(localVersion: Int, remoteVersion: Int): ConflictResolution =
        when {
            localVersion > remoteVersion -> ConflictResolution.KEEP_LOCAL
            remoteVersion > localVersion -> ConflictResolution.KEEP_REMOTE
            else -> ConflictResolution.MERGE_REQUIRED
        }

    fun <T> choose(
        local: T,
        remote: T,
        localVersion: Int,
        remoteVersion: Int
    ): T? = when (resolve(localVersion, remoteVersion)) {
        ConflictResolution.KEEP_LOCAL -> local
        ConflictResolution.KEEP_REMOTE -> remote
        ConflictResolution.MERGE_REQUIRED -> null
    }
}
