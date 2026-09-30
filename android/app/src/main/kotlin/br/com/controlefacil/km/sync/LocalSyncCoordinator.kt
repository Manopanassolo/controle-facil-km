package br.com.controlefacil.km.sync

import br.com.controlefacil.km.core.local.ExpenseLocalRepository
import br.com.controlefacil.km.core.local.TripLocalRepository
import br.com.controlefacil.km.core.local.VehicleLocalRepository
import br.com.controlefacil.km.core.model.Expense
import br.com.controlefacil.km.core.model.Trip
import br.com.controlefacil.km.core.model.Vehicle
import java.time.Instant

class LocalSyncMapper(
    private val userId: String
) {
    fun vehicle(vehicle: Vehicle) = RemoteVehicle(
        id = vehicle.id,
        user_id = userId,
        name = vehicle.name,
        brand = vehicle.brand,
        model = vehicle.model,
        year = vehicle.year,
        plate = vehicle.plate,
        fuel_type = vehicle.fuelType,
        initial_odometer_m = vehicle.initialOdometerM,
        current_odometer_m = vehicle.currentOdometerM,
        is_default = vehicle.isDefault,
        is_active = vehicle.isActive
    )

    fun trip(trip: Trip) = RemoteTrip(
        id = trip.id,
        user_id = userId,
        vehicle_id = trip.vehicleId,
        trip_date = trip.tripDate,
        start_odometer_m = trip.startOdometerM,
        end_odometer_m = trip.endOdometerM,
        origin = trip.origin,
        destination = trip.destination,
        trip_type = trip.tripType.name.lowercase(),
        purpose = trip.purpose,
        notes = trip.notes,
        status = trip.status.name.lowercase()
    )

    fun expense(expense: Expense) = RemoteExpense(
        id = expense.id,
        user_id = userId,
        vehicle_id = expense.vehicleId,
        category_id = expense.categoryId,
        trip_id = expense.tripId,
        expense_date = expense.expenseDate,
        description = expense.description,
        amount_cents = expense.amountCents,
        odometer_m = expense.odometerM,
        merchant = expense.merchant,
        payment_method = expense.paymentMethod?.name?.lowercase(),
        notes = expense.notes
    )
}

class LocalSyncCoordinator(
    private val connectivity: SyncConnectivity,
    private val authUserId: () -> String?,
    private val vehicles: VehicleLocalRepository,
    private val trips: TripLocalRepository,
    private val expenses: ExpenseLocalRepository,
    private val remote: SupabaseSyncRepository
) {
    suspend fun run(): Result<SyncResult> {
        if (!connectivity.isOnline()) return Result.success(SyncResult())
        val userId = authUserId() ?: return Result.failure(IllegalStateException("Usuário não autenticado."))
        val mapper = LocalSyncMapper(userId)

        val vehicleResult = remote.syncVehicles(vehicles.listActive().map(mapper::vehicle)).getOrElse {
            return Result.failure(it)
        }
        val tripResult = remote.syncTrips(trips.list().map(mapper::trip)).getOrElse {
            return Result.failure(it)
        }

        // Despesas dependem de categorias remotas UUID. Enquanto a categoria local
        // não estiver resolvida contra expense_categories, elas permanecem somente locais.
        return Result.success(
            SyncResult(
                uploaded = vehicleResult.uploaded + tripResult.uploaded,
                downloaded = vehicleResult.remoteWins.size + tripResult.remoteWins.size,
                conflicts = vehicleResult.conflicts.size + tripResult.conflicts.size
            )
        )
    }
}
