package br.com.controlefacil.km.core.local

import android.content.Context
import br.com.controlefacil.km.core.model.ExpenseCategory
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

class ExpenseCategoryLocalRepository(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_local", Context.MODE_PRIVATE)

    fun listActive(): List<ExpenseCategory> =
        readAll().filter { it.isActive }.sortedBy { it.sortOrder }

    fun seedDefaultsIfEmpty() {
        if (readAll().isNotEmpty()) return
        writeAll(DEFAULTS)
    }

    fun replaceAll(categories: List<ExpenseCategory>) = writeAll(categories)

    fun mergeRemote(remote: List<ExpenseCategory>): Map<String, String> {
        seedDefaultsIfEmpty()
        val local = readAll()
        val remoteByName = remote.associateBy { normalize(it.name) }
        val idMap = local.mapNotNull { localCategory ->
            remoteByName[normalize(localCategory.name)]?.let { localCategory.id to it.id }
        }.toMap()
        if (remote.isNotEmpty()) writeAll(remote)
        return idMap
    }

    private fun readAll(): List<ExpenseCategory> {
        val array = JSONArray(preferences.getString(KEY, "[]") ?: "[]")
        return buildList {
            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                add(
                    ExpenseCategory(
                        id = o.getString("id"),
                        name = o.getString("name"),
                        icon = o.optString("icon").takeIf { it.isNotBlank() },
                        color = o.optString("color").takeIf { it.isNotBlank() },
                        sortOrder = o.optInt("sortOrder", 0),
                        isSystem = o.optBoolean("isSystem", true),
                        isActive = o.optBoolean("isActive", true)
                    )
                )
            }
        }
    }

    private fun writeAll(categories: List<ExpenseCategory>) {
        val array = JSONArray()
        categories.forEach { c ->
            array.put(JSONObject().apply {
                put("id", c.id)
                put("name", c.name)
                put("icon", c.icon)
                put("color", c.color)
                put("sortOrder", c.sortOrder)
                put("isSystem", c.isSystem)
                put("isActive", c.isActive)
            })
        }
        preferences.edit().putString(KEY, array.toString()).apply()
    }

    private fun normalize(value: String) =
        java.text.Normalizer.normalize(value.trim(), java.text.Normalizer.Form.NFD)
            .replace("\\p{Mn}+".toRegex(), "").lowercase()

    companion object {
        private const val KEY = "expense_categories"
        private val DEFAULTS = listOf(
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000001").toString(), "Combustível", "fuel", sortOrder = 10),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000002").toString(), "Pedágio", "toll", sortOrder = 20),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000003").toString(), "Estacionamento", "parking", sortOrder = 30),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000004").toString(), "Alimentação", "restaurant", sortOrder = 40),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000005").toString(), "Manutenção", "wrench", sortOrder = 50),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000006").toString(), "Lavagem", "car-wash", sortOrder = 60),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000007").toString(), "Seguro", "shield", sortOrder = 70),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000008").toString(), "IPVA", "file-text", sortOrder = 80),
            ExpenseCategory(UUID.fromString("00000000-0000-0000-0000-000000000009").toString(), "Outros", "more-horizontal", sortOrder = 90)
        )
    }
}
