package br.com.controlefacil.km.sync

object PendingSyncPolicy {
    fun add(current: Set<String>, recordId: String): Set<String> =
        current + recordId

    fun remove(current: Set<String>, recordId: String): Set<String> =
        current - recordId

    fun normalized(current: Set<String>?): Set<String> =
        current?.toSet() ?: emptySet()
}
