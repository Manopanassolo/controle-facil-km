package br.com.controlefacil.km.core.local

import android.content.SharedPreferences
import org.json.JSONArray
import java.util.UUID

class LocalJsonStore(private val preferences: SharedPreferences) {
    data class ReadResult(val json: JSONArray, val recovered: Boolean)

    fun readArray(key: String): ReadResult {
        val raw = preferences.getString(key, "[]") ?: "[]"
        return runCatching { ReadResult(JSONArray(raw), false) }.getOrElse {
            backupCorruptValue(key, raw)
            preferences.edit().putString(key, "[]").apply()
            ReadResult(JSONArray(), true)
        }
    }

    private fun backupCorruptValue(key: String, raw: String) {
        val backupKey = "corrupt_backup_" + key + "_" + UUID.randomUUID().toString()
        preferences.edit().putString(backupKey, raw).apply()
    }
}