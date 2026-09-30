package br.com.controlefacil.km.sync

object SyncApplyPolicy {
    fun <T> retainUploadedRows(
        remote: List<T>,
        uploaded: List<T>,
        idOf: (T) -> String
    ): List<T> {
        val uploadedIds = uploaded.map(idOf).toSet()
        return buildList {
            addAll(remote.filterNot { idOf(it) in uploadedIds })
            addAll(uploaded)
        }
    }

    fun <T> retainConflictRows(
        remote: List<T>,
        conflicts: List<SyncConflict<T>>,
        idOf: (T) -> String
    ): List<T> {
        val conflictIds = conflicts.map { idOf(it.local) }.toSet()
        val remoteRows = remote.filterNot { idOf(it) in conflictIds }
        return buildList {
            addAll(remoteRows)
            addAll(conflicts.map { it.local })
        }
    }
}
