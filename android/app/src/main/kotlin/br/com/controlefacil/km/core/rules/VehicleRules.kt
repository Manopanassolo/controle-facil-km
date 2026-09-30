package br.com.controlefacil.km.core.rules

import br.com.controlefacil.km.core.model.Vehicle

data class VehicleValidation(
    val valid: Boolean,
    val message: String? = null
)

object VehicleRules {
    fun validate(
        name: String,
        brand: String?,
        model: String?,
        year: Int?,
        plate: String?,
        initialOdometerM: Long
    ): VehicleValidation {
        if (name.trim().isEmpty()) return VehicleValidation(false, "Informe um nome para o veículo.")
        if (year != null && (year < 1900 || year > 2100)) return VehicleValidation(false, "Informe um ano válido.")
        if (initialOdometerM < 0L) return VehicleValidation(false, "O KM inicial não pode ser negativo.")
        if (!plate.isNullOrBlank()) {
            val normalized = normalizePlate(plate)!!
            val oldPlate = normalized.matches(Regex("[A-Z]{3}[0-9]{4}"))
            val mercosulPlate = normalized.matches(Regex("[A-Z]{3}[0-9][A-Z][0-9]{2}"))
            if (!oldPlate && !mercosulPlate) return VehicleValidation(false, "Informe uma placa válida.")
        }
        return VehicleValidation(true)
    }

    fun normalizePlate(plate: String?): String? =
        plate?.trim()?.uppercase()?.replace("-", "")?.takeIf { it.isNotEmpty() }

    fun nextDefaultVehicle(vehicles: List<Vehicle>, candidate: Vehicle): List<Vehicle> =
        vehicles.map { it.copy(isDefault = false) } + candidate.copy(isDefault = true)
}
