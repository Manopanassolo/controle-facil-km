package br.com.controlefacil.km.core.local

import android.content.Context
import br.com.controlefacil.km.core.model.Attachment
import br.com.controlefacil.km.core.model.AttachmentSyncState
import br.com.controlefacil.km.core.rules.AttachmentRules
import org.json.JSONArray
import org.json.JSONObject

class AttachmentLocalRepository(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_local", Context.MODE_PRIVATE)

    fun list(): List<Attachment> {
        val array = JSONArray(preferences.getString(KEY, "[]") ?: "[]")
        return buildList {
            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                add(
                    Attachment(
                        id = o.getString("id"),
                        expenseId = o.optString("expenseId").takeIf { it.isNotBlank() },
                        tripId = o.optString("tripId").takeIf { it.isNotBlank() },
                        localUri = o.getString("localUri"),
                        storagePath = o.optString("storagePath").takeIf { it.isNotBlank() },
                        originalFilename = o.getString("originalFilename"),
                        mimeType = o.getString("mimeType"),
                        fileSizeBytes = o.getLong("fileSizeBytes"),
                        sha256 = o.optString("sha256").takeIf { it.isNotBlank() },
                        width = o.optInt("width", -1).takeIf { it >= 0 },
                        height = o.optInt("height", -1).takeIf { it >= 0 },
                        uploadedAt = o.optString("uploadedAt").takeIf { it.isNotBlank() },
                        state = runCatching { AttachmentSyncState.valueOf(o.optString("state", "LOCAL_ONLY")) }.getOrDefault(AttachmentSyncState.LOCAL_ONLY),
                        error = o.optString("error").takeIf { it.isNotBlank() }
                    )
                )
            }
        }
    }

    fun save(attachment: Attachment): Result<Unit> = runCatching {
        AttachmentRules.validate(attachment).getOrThrow()
        val existing = list().filterNot { it.id == attachment.id }
        writeAll(existing + attachment)
    }

    fun pending(): List<Attachment> = list().filter { it.state == AttachmentSyncState.LOCAL_ONLY || it.state == AttachmentSyncState.ERROR }

    fun updateState(id: String, state: AttachmentSyncState, storagePath: String? = null, uploadedAt: String? = null, error: String? = null) {
        val updated = list().map {
            if (it.id != id) it else it.copy(
                state = state,
                storagePath = storagePath ?: it.storagePath,
                uploadedAt = uploadedAt ?: it.uploadedAt,
                error = error
            )
        }
        writeAll(updated)
    }

    fun replaceAll(items: List<Attachment>) = writeAll(items)

    private fun writeAll(items: List<Attachment>) {
        val array = JSONArray()
        items.forEach { a ->
            array.put(JSONObject().apply {
                put("id", a.id)
                put("expenseId", a.expenseId)
                put("tripId", a.tripId)
                put("localUri", a.localUri)
                put("storagePath", a.storagePath)
                put("originalFilename", a.originalFilename)
                put("mimeType", a.mimeType)
                put("fileSizeBytes", a.fileSizeBytes)
                put("sha256", a.sha256)
                put("width", a.width)
                put("height", a.height)
                put("uploadedAt", a.uploadedAt)
                put("state", a.state.name)
                put("error", a.error)
            })
        }
        preferences.edit().putString(KEY, array.toString()).apply()
    }

    companion object { private const val KEY = "attachments" }
}
