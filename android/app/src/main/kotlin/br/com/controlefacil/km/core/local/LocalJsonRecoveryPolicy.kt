package br.com.controlefacil.km.core.local

import org.json.JSONArray

object LocalJsonRecoveryPolicy {
    data class Decision(val json: JSONArray, val recovered: Boolean)

    fun parse(raw: String?): Decision =
        runCatching { Decision(JSONArray(raw ?: "[]"), false) }
            .getOrElse { Decision(JSONArray(), true) }
}
