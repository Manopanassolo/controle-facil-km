package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.model.Trip
import br.com.controlefacil.km.core.model.TripStatus
import br.com.controlefacil.km.core.model.TripType
import br.com.controlefacil.km.core.model.Vehicle
import br.com.controlefacil.km.sync.LocalSyncMapper
import org.junit.Assert.assertEquals
import org.junit.Test

class LocalSyncMapperTest {
    private val mapper = LocalSyncMapper("user-123")

    @Test fun vehicleCarriesAuthenticatedUserId() {
        val remote = mapper.vehicle(Vehicle("v1", "Carro"))
        assertEquals("user-123", remote.user_id)
        assertEquals("v1", remote.id)
    }

    @Test fun tripCarriesVehicleAndUser() {
        val remote = mapper.trip(
            Trip("t1", "v1", "2026-09-30", 1000, 1200, tripType = TripType.PERSONAL, status = TripStatus.COMPLETED)
        )
        assertEquals("user-123", remote.user_id)
        assertEquals("v1", remote.vehicle_id)
        assertEquals("completed", remote.status)
    }
}
