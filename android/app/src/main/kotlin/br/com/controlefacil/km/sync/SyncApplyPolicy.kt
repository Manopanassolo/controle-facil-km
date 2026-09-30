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
        return retainConflictIds(remote, conflictIds, conflicts.map { it.local }, idOf)
    }

    fun <T> retainConflictIds(
        remote: List<T>,
        conflictIds: Collection<String>,
        localRows: Collection<T>,
        idOf: (T) -> String
    ): List<T> {
        val ids = conflictIds.toSet()
        return buildList {
            addAll(remote.filterNot { idOf(it) in ids })
            addAll(localRows)
        }
    }
}
