package br.com.controlefacil.km.core.rules

import br.com.controlefacil.km.core.model.Vehicle

object VehicleSelectionRules {
    fun selectedVehicle(vehicles: List<Vehicle>, selectedId: String?): Vehicle? {
        if (selectedId == null) return null
        return vehicles.firstOrNull { it.id == selectedId && it.isActive }
    }

    fun initialSelection(vehicles: List<Vehicle>): String? =
        vehicles.firstOrNull { it.isDefault && it.isActive }?.id
            ?: vehicles.firstOrNull { it.isActive }?.id
}
