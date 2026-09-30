package br.com.controlefacil.km.sync

import android.content.Context

enum class SyncUiState { OFFLINE, PENDING, SYNCING, SYNCED, ERROR }

class SyncStatusStore(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_sync", Context.MODE_PRIVATE)

    fun get(): SyncUiState =
        runCatching {
            SyncUiState.valueOf(preferences.getString(KEY, SyncUiState.PENDING.name) ?: SyncUiState.PENDING.name)
        }.getOrDefault(SyncUiState.PENDING)

    fun set(state: SyncUiState) {
        preferences.edit().putString(KEY, state.name).apply()
    }

    companion object {
        private const val KEY = "ui_state"
    }
}
