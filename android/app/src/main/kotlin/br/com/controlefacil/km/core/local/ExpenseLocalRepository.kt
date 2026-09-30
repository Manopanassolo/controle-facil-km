package br.com.controlefacil.km.core.local

import android.content.Context
import br.com.controlefacil.km.core.model.Expense
import br.com.controlefacil.km.core.model.ExpensePayment
import br.com.controlefacil.km.core.rules.ExpenseRules
import org.json.JSONArray
import org.json.JSONObject

class ExpenseLocalRepository(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_local", Context.MODE_PRIVATE)

    fun list(): List<Expense> {
        val raw = preferences.getString(KEY_EXPENSES, "[]") ?: "[]"
        val array = JSONArray(raw)
        return buildList {
            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                add(
                    Expense(
                        id = o.getString("id"),
                        vehicleId = o.getString("vehicleId"),
                        categoryId = o.getString("categoryId"),
                        tripId = o.optString("tripId").takeIf { it.isNotBlank() },
                        expenseDate = o.getString("expenseDate"),
                        description = o.getString("description"),
                        amountCents = o.getLong("amountCents"),
                        odometerM = if (o.has("odometerM") && !o.isNull("odometerM")) o.getLong("odometerM") else null,
                        merchant = o.optString("merchant").takeIf { it.isNotBlank() },
                        paymentMethod = o.optString("paymentMethod").takeIf { it.isNotBlank() }?.let { runCatching { ExpensePayment.valueOf(it) }.getOrNull() },
                        notes = o.optString("notes").takeIf { it.isNotBlank() }
                    )
                )
            }
        }
    }

    fun save(
        vehicleId: String,
        categoryId: String,
        tripId: String?,
        expenseDate: String,
        description: String,
        amountCents: Long,
        odometerM: Long?,
        merchant: String?,
        paymentMethod: ExpensePayment?,
        notes: String?
    ): Result<Expense> {
        val validation = ExpenseRules.validate(description, amountCents, expenseDate, vehicleId)
        if (!validation.valid) return Result.failure(IllegalArgumentException(validation.message))
        if (odometerM != null && odometerM < 0L) {
            return Result.failure(IllegalArgumentException("O KM da despesa não pode ser negativo."))
        }
        val expense = Expense(
            id = java.util.UUID.randomUUID().toString(),
            vehicleId = vehicleId,
            categoryId = categoryId,
            tripId = tripId,
            expenseDate = expenseDate,
            description = description.trim(),
            amountCents = amountCents,
            odometerM = odometerM,
            merchant = merchant?.trim()?.takeIf { it.isNotEmpty() },
            paymentMethod = paymentMethod,
            notes = notes?.trim()?.takeIf { it.isNotEmpty() }
        )
        val expenses = list() + expense
        val array = JSONArray()
        expenses.forEach { e ->
            array.put(JSONObject().apply {
                put("id", e.id)
                put("vehicleId", e.vehicleId)
                put("categoryId", e.categoryId)
                put("tripId", e.tripId)
                put("expenseDate", e.expenseDate)
                put("description", e.description)
                put("amountCents", e.amountCents)
                put("odometerM", e.odometerM)
                put("merchant", e.merchant)
                put("paymentMethod", e.paymentMethod?.name)
                put("notes", e.notes)
            })
        }
        preferences.edit().putString(KEY_EXPENSES, array.toString()).apply()
        return Result.success(expense)
    }

    companion object {
        private const val KEY_EXPENSES = "expenses"
    }
}
