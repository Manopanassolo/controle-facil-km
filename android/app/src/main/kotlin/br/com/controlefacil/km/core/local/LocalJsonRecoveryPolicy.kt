package br.com.controlefacil.km.core.local

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.jsonArray

object LocalJsonRecoveryPolicy {
    data class Decision(val json: JsonArray, val recovered: Boolean)

    fun parse(raw: String?): Decision =
        runCatching { Json.parseToJsonElement(raw ?: "[]").jsonArray }
            .map { Decision(it, false) }
            .getOrElse { Decision(JsonArray(emptyList()), true) }
}
