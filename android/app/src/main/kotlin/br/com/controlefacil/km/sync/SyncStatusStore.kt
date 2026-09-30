package br.com.controlefacil.km.sync

import android.content.Context

enum class SyncUiState { OFFLINE, PENDING, SYNCING, SYNCED, ERROR }

class SyncStatusStore(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_sync", Context.MODE_PRIVATE)

    fun state(): SyncUiState = runCatching {
        SyncUiState.valueOf(preferences.getString(KEY_STATE, SyncUiState.SYNCED.name) ?: SyncUiState.SYNCED.name)
    }.getOrDefault(SyncUiState.SYNCED)

    fun set(state: SyncUiState) {
        preferences.edit().putString(KEY_STATE, state.name).apply()
    }

    companion object { private const val KEY_STATE = "state" }
}
