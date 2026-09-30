package br.com.controlefacil.km.core.rules

data class TripValidation(
    val valid: Boolean,
    val message: String? = null
)

object TripRules {
    fun validateOdometers(initialKm: Long?, finalKm: Long?): TripValidation {
        if (initialKm == null || initialKm < 0L) {
            return TripValidation(false, "Informe um KM inicial válido.")
        }
        if (finalKm != null && finalKm < initialKm) {
            return TripValidation(false, "O KM final não pode ser menor que o KM inicial.")
        }
        return TripValidation(true)
    }

    fun distanceKm(initialKm: Long, finalKm: Long): Long {
        require(initialKm >= 0L) { "KM inicial inválido." }
        require(finalKm >= initialKm) { "KM final inválido." }
        return finalKm - initialKm
    }
}
