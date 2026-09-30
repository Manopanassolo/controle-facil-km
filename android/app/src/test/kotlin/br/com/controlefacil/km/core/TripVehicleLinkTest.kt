package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.model.Trip
import br.com.controlefacil.km.core.model.TripStatus
import br.com.controlefacil.km.core.rules.TripRules
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Test

class TripVehicleLinkTest {
    @Test fun viagemMantemIdDoVeiculoSelecionado() {
        val trip = Trip(
            id = "trip-1",
            vehicleId = "vehicle-2",
            tripDate = "2026-09-30",
            startOdometerM = 1000,
            endOdometerM = 1200,
            status = TripStatus.COMPLETED
        )
        assertEquals("vehicle-2", trip.vehicleId)
    }

    @Test fun distanciaDaViagemContinuaIndependenteDoNomeDoVeiculo() {
        val trip = Trip(
            id = "trip-1",
            vehicleId = "vehicle-2",
            tripDate = "2026-09-30",
            startOdometerM = 1000,
            endOdometerM = 1200
        )
        assertEquals(200L, trip.distanceM)
    }

    @Test fun kmFinalInvalidoNaoGeraDistancia() {
        val trip = Trip(
            id = "trip-1",
            vehicleId = "vehicle-2",
            tripDate = "2026-09-30",
            startOdometerM = 1200,
            endOdometerM = 1000
        )
        assertEquals(null, trip.distanceM)
        assertFalse(TripRules.validateOdometers(1200, 1000).valid)
    }
}
