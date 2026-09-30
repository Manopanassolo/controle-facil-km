package br.com.controlefacil.km.core.local

import android.content.Context
import br.com.controlefacil.km.core.model.Vehicle
import br.com.controlefacil.km.core.rules.VehicleRules
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

class VehicleLocalRepository(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_local", Context.MODE_PRIVATE)

    fun listActive(): List<Vehicle> = readAll().filter { it.isActive }\n\n    fun replaceAll(vehicles: List<Vehicle>) = writeAll(vehicles)

    fun save(
        name: String,
        brand: String?,
        model: String?,
        year: Int?,
        plate: String?,
        fuelType: String,
        initialOdometerM: Long,
        makeDefault: Boolean
    ): Result<Vehicle> {
        val validation = VehicleRules.validate(name, brand, model, year, plate, initialOdometerM)
        if (!validation.valid) return Result.failure(IllegalArgumentException(validation.message))

        val all = readAll().toMutableList()
        val vehicle = Vehicle(
            id = UUID.randomUUID().toString(),
            name = name.trim(),
            brand = brand?.trim()?.takeIf { it.isNotEmpty() },
            model = model?.trim()?.takeIf { it.isNotEmpty() },
            year = year,
            plate = VehicleRules.normalizePlate(plate),
            fuelType = fuelType.ifBlank { "flex" },
            initialOdometerM = initialOdometerM,
            currentOdometerM = initialOdometerM,
            isDefault = makeDefault || all.none { it.isActive },
            isActive = true
        )

        val updated = if (vehicle.isDefault) {
            all.map { it.copy(isDefault = false) }.toMutableList().apply { add(vehicle) }
        } else {
            all.apply { add(vehicle) }
        }
        writeAll(updated)
        return Result.success(vehicle)
    }

    fun setDefault(id: String): Boolean {
        val all = readAll()
        if (all.none { it.id == id && it.isActive }) return false
        writeAll(all.map { it.copy(isDefault = it.id == id) })
        return true
    }

    fun deactivate(id: String): Boolean {
        val all = readAll()
        val target = all.firstOrNull { it.id == id && it.isActive } ?: return false
        val remaining = all.filter { it.isActive && it.id != id }
        val wasDefault = target.isDefault
        val updated = all.map { vehicle ->
            if (vehicle.id == id) vehicle.copy(isActive = false, isDefault = false)
            else if (wasDefault && vehicle.isActive && remaining.firstOrNull()?.id == vehicle.id) vehicle.copy(isDefault = true)
            else vehicle
        }
        writeAll(updated)
        return true
    }

    fun getDefault(): Vehicle? = listActive().firstOrNull { it.isDefault }

    private fun readAll(): List<Vehicle> {
        val raw = preferences.getString(KEY_VEHICLES, "[]") ?: "[]"
        val array = JSONArray(raw)
        return buildList {
            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                add(
                    Vehicle(
                        id = o.getString("id"),
                        name = o.getString("name"),
                        brand = o.optString("brand").takeIf { it.isNotBlank() },
                        model = o.optString("model").takeIf { it.isNotBlank() },
                        year = if (o.has("year") && !o.isNull("year")) o.getInt("year") else null,
                        plate = o.optString("plate").takeIf { it.isNotBlank() },
                        fuelType = o.optString("fuelType", "flex"),
                        initialOdometerM = o.optLong("initialOdometerM", 0L),
                        currentOdometerM = o.optLong("currentOdometerM", 0L),
                        isDefault = o.optBoolean("isDefault", false),
                        isActive = o.optBoolean("isActive", true)
                    )
                )
            }
        }
    }

    private fun writeAll(vehicles: List<Vehicle>) {
        val array = JSONArray()
        vehicles.forEach { v ->
            array.put(
                JSONObject().apply {
                    put("id", v.id)
                    put("name", v.name)
                    put("brand", v.brand)
                    put("model", v.model)
                    put("year", v.year)
                    put("plate", v.plate)
                    put("fuelType", v.fuelType)
                    put("initialOdometerM", v.initialOdometerM)
                    put("currentOdometerM", v.currentOdometerM)
                    put("isDefault", v.isDefault)
                    put("isActive", v.isActive)
                }
            )
        }
        preferences.edit().putString(KEY_VEHICLES, array.toString()).apply()
    }

    companion object {
        private const val KEY_VEHICLES = "vehicles"
    }
}
