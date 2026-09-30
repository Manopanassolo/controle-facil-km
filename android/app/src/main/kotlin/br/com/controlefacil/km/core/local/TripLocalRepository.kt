package br.com.controlefacil.km.core.local

import android.content.Context
import br.com.controlefacil.km.core.model.Trip
import br.com.controlefacil.km.core.model.TripStatus
import br.com.controlefacil.km.core.model.TripType
import org.json.JSONArray
import org.json.JSONObject

class TripLocalRepository(context: Context) {
    private val preferences = context.getSharedPreferences("controle_facil_km_local", Context.MODE_PRIVATE)

    fun list(): List<Trip> {
        val raw = preferences.getString(KEY_TRIPS, "[]") ?: "[]"
        val array = LocalJsonRecoveryPolicy.parse(raw).json
        return buildList {
            for (i in 0 until array.length()) {
                val o = array.getJSONObject(i)
                add(
                    Trip(
                        id = o.getString("id"),
                        vehicleId = o.getString("vehicleId"),
                        tripDate = o.getString("tripDate"),
                        startOdometerM = o.getLong("startOdometerM"),
                        endOdometerM = if (o.has("endOdometerM") && !o.isNull("endOdometerM")) o.getLong("endOdometerM") else null,
                        origin = o.optString("origin").takeIf { it.isNotBlank() },
                        destination = o.optString("destination").takeIf { it.isNotBlank() },
                        tripType = runCatching { TripType.valueOf(o.optString("tripType", TripType.PERSONAL.name)) }.getOrDefault(TripType.PERSONAL),
                        purpose = o.optString("purpose").takeIf { it.isNotBlank() },
                        notes = o.optString("notes").takeIf { it.isNotBlank() },
                        status = runCatching { TripStatus.valueOf(o.optString("status", TripStatus.DRAFT.name)) }.getOrDefault(TripStatus.DRAFT)
                    )
                )
            }
        }
    }

    fun replaceAll(trips: List<Trip>) {
        val array = JSONArray()
        trips.forEach { tr -> array.put(JSONObject().apply {
            put("id", tr.id); put("vehicleId", tr.vehicleId); put("tripDate", tr.tripDate); put("startOdometerM", tr.startOdometerM); put("endOdometerM", tr.endOdometerM); put("origin", tr.origin); put("destination", tr.destination); put("tripType", tr.tripType.name); put("purpose", tr.purpose); put("notes", tr.notes); put("status", tr.status.name)
        }) }
        preferences.edit().putString(KEY_TRIPS, array.toString()).apply()
    }

    fun save(trip: Trip) {
        val trips = list().filterNot { it.id == trip.id } + trip
        val array = JSONArray()
        trips.forEach { t ->
            array.put(
                JSONObject().apply {
                    put("id", t.id)
                    put("vehicleId", t.vehicleId)
                    put("tripDate", t.tripDate)
                    put("startOdometerM", t.startOdometerM)
                    put("endOdometerM", t.endOdometerM)
                    put("origin", t.origin)
                    put("destination", t.destination)
                    put("tripType", t.tripType.name)
                    put("purpose", t.purpose)
                    put("notes", t.notes)
                    put("status", t.status.name)
                }
            )
        }
        preferences.edit().putString(KEY_TRIPS, array.toString()).apply()
    }

    companion object {
        private const val KEY_TRIPS = "trips"
    }
}
