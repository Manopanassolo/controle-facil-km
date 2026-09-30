package br.com.controlefacil.km.sync

import android.content.Context

class PendingSyncStore(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_local", Context.MODE_PRIVATE)

    fun markPending(recordType: String, recordId: String) {
        val key = key(recordType)
        val values = pending(recordType).toMutableSet()
        val next = PendingSyncPolicy.add(values, recordId)
        preferences.edit().putStringSet(key, next).apply()
    }

    fun clear(recordType: String, recordId: String) {
        val values = pending(recordType).toMutableSet()
        val next = PendingSyncPolicy.remove(values, recordId)
        preferences.edit().putStringSet(key(recordType), next).apply()
    }

    fun pending(recordType: String): Set<String> =
        PendingSyncPolicy.normalized(preferences.getStringSet(key(recordType), emptySet()))

    private fun key(recordType: String) = "sync_pending_$recordType"
}
