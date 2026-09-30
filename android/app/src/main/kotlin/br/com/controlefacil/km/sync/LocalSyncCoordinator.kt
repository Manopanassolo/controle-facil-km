package br.com.controlefacil.km.sync

import br.com.controlefacil.km.core.local.ExpenseCategoryLocalRepository
import br.com.controlefacil.km.core.local.ExpenseLocalRepository
import br.com.controlefacil.km.core.local.TripLocalRepository
import br.com.controlefacil.km.core.local.VehicleLocalRepository
import br.com.controlefacil.km.core.model.Expense
import br.com.controlefacil.km.core.model.ExpensePayment
import br.com.controlefacil.km.core.model.Trip
import br.com.controlefacil.km.core.model.TripStatus
import br.com.controlefacil.km.core.model.TripType
import br.com.controlefacil.km.core.model.Vehicle

class LocalSyncMapper(private val userId: String) {
    fun vehicle(v: Vehicle) = RemoteVehicle(
        id = v.id, user_id = userId, name = v.name, brand = v.brand, model = v.model,
        year = v.year, plate = v.plate, fuel_type = v.fuelType,
        initial_odometer_m = v.initialOdometerM, current_odometer_m = v.currentOdometerM,
        is_default = v.isDefault, is_active = v.isActive
    )

    fun trip(t: Trip) = RemoteTrip(
        id = t.id, user_id = userId, vehicle_id = t.vehicleId, trip_date = t.tripDate,
        start_odometer_m = t.startOdometerM, end_odometer_m = t.endOdometerM,
        origin = t.origin, destination = t.destination, trip_type = t.tripType.name.lowercase(),
        purpose = t.purpose, notes = t.notes, status = t.status.name.lowercase()
    )

    fun expense(e: Expense) = RemoteExpense(
        id = e.id, user_id = userId, vehicle_id = e.vehicleId, category_id = e.categoryId,
        trip_id = e.tripId, expense_date = e.expenseDate, description = e.description,
        amount_cents = e.amountCents, odometer_m = e.odometerM, merchant = e.merchant,
        payment_method = e.paymentMethod?.name?.lowercase(), notes = e.notes
    )
}

class LocalSyncCoordinator(
    private val connectivity: SyncConnectivity,
    private val authUserId: () -> String?,
    private val vehicles: VehicleLocalRepository,
    private val trips: TripLocalRepository,
    private val categories: ExpenseCategoryLocalRepository,
    private val expenses: ExpenseLocalRepository,
    private val remote: SupabaseSyncRepository
) {
    suspend fun run(): Result<SyncResult> {
        if (!connectivity.isOnline()) return Result.success(SyncResult())
        val userId = authUserId() ?: return Result.failure(IllegalStateException("Usuário não autenticado."))
        val mapper = LocalSyncMapper(userId)

        categories.seedDefaultsIfEmpty()
        val remoteCategories = remote.loadExpenseCategories().getOrElse { return Result.failure(it) }
        val categoryIdMap = categories.mergeRemote(remoteCategories)
        expenses.remapCategoryIds(categoryIdMap)

        val vehicleBatch = remote.syncVehicles(vehicles.listActive().map(mapper::vehicle)).getOrElse { return Result.failure(it) }
        val tripBatch = remote.syncTrips(trips.list().map(mapper::trip)).getOrElse { return Result.failure(it) }
        val expenseBatch = remote.syncExpenses(expenses.list().map(mapper::expense)).getOrElse { return Result.failure(it) }

        applyVehicles(vehicleBatch)
        applyTrips(tripBatch)
        applyExpenses(expenseBatch)

        return Result.success(
            SyncResult(
                uploaded = vehicleBatch.uploaded + tripBatch.uploaded + expenseBatch.uploaded,
                downloaded = vehicleBatch.remoteWins.size + tripBatch.remoteWins.size + expenseBatch.remoteWins.size,
                conflicts = vehicleBatch.conflicts.size + tripBatch.conflicts.size + expenseBatch.conflicts.size
            )
        )
    }

    private fun applyVehicles(batch: SyncBatch<RemoteVehicle>) {
        val conflictIds = batch.conflicts.map { it.local.id }.toSet()
        val remoteRows = batch.remote.filter { it.deleted_at == null }.filterNot { it.id in conflictIds }.map {
            Vehicle(
                id = it.id, name = it.name, brand = it.brand, model = it.model, year = it.year,
                plate = it.plate, fuelType = it.fuel_type, initialOdometerM = it.initial_odometer_m,
                currentOdometerM = it.current_odometer_m, isDefault = it.is_default, isActive = it.is_active
            )
        }
        vehicles.replaceAll((remoteRows + batch.conflicts.map { it.local }).distinctBy { it.id })
    }

    private fun applyTrips(batch: SyncBatch<RemoteTrip>) {
        val conflictIds = batch.conflicts.map { it.local.id }.toSet()
        val remoteRows = batch.remote.filter { it.deleted_at == null }.filterNot { it.id in conflictIds }.map {
            Trip(
                id = it.id, vehicleId = it.vehicle_id, tripDate = it.trip_date,
                startOdometerM = it.start_odometer_m, endOdometerM = it.end_odometer_m,
                origin = it.origin, destination = it.destination,
                tripType = runCatching { TripType.valueOf(it.trip_type.uppercase()) }.getOrDefault(TripType.PERSONAL),
                purpose = it.purpose, notes = it.notes,
                status = runCatching { TripStatus.valueOf(it.status.uppercase()) }.getOrDefault(TripStatus.DRAFT)
            )
        }
        trips.replaceAll((remoteRows + batch.conflicts.map { it.local }).distinctBy { it.id })
    }

    private fun applyExpenses(batch: SyncBatch<RemoteExpense>) {
        val conflictIds = batch.conflicts.map { it.local.id }.toSet()
        val remoteRows = batch.remote.filter { it.deleted_at == null }.filterNot { it.id in conflictIds }.map {
            Expense(
                id = it.id, vehicleId = it.vehicle_id, categoryId = it.category_id, tripId = it.trip_id,
                expenseDate = it.expense_date, description = it.description, amountCents = it.amount_cents,
                odometerM = it.odometer_m, merchant = it.merchant,
                paymentMethod = it.payment_method?.let { method ->
                    runCatching { ExpensePayment.valueOf(method.uppercase()) }.getOrNull()
                },
                notes = it.notes
            )
        }
        expenses.replaceAll((remoteRows + batch.conflicts.map { it.local }).distinctBy { it.id })
    }
}
