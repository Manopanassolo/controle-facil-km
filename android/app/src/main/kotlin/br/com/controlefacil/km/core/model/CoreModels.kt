package br.com.controlefacil.km.core.model

enum class SyncState { OFFLINE, PENDING, SYNCING, SYNCED, ERROR }
enum class TripType { PERSONAL, WORK, OTHER }
enum class TripStatus { DRAFT, COMPLETED, CANCELLED }
enum class ExpensePayment { CASH, DEBIT, CREDIT, PIX, TRANSFER, OTHER }

data class Vehicle(
    val id: String,
    val name: String,
    val brand: String? = null,
    val model: String? = null,
    val year: Int? = null,
    val plate: String? = null,
    val fuelType: String = "flex",
    val initialOdometerM: Long = 0,
    val currentOdometerM: Long = 0,
    val isDefault: Boolean = false,
    val isActive: Boolean = true
)

data class Trip(
    val id: String,
    val vehicleId: String,
    val tripDate: String,
    val startOdometerM: Long,
    val endOdometerM: Long? = null,
    val origin: String? = null,
    val destination: String? = null,
    val tripType: TripType = TripType.PERSONAL,
    val purpose: String? = null,
    val notes: String? = null,
    val status: TripStatus = TripStatus.DRAFT
) {
    val distanceM: Long?
        get() = endOdometerM?.takeIf { it >= startOdometerM }?.minus(startOdometerM)
}

data class Expense(
    val id: String,
    val vehicleId: String,
    val categoryId: String,
    val tripId: String? = null,
    val expenseDate: String,
    val description: String,
    val amountCents: Long,
    val odometerM: Long? = null,
    val merchant: String? = null,
    val paymentMethod: ExpensePayment? = null,
    val notes: String? = null
)

data class CalendarEvent(
    val id: String,
    val googleEventId: String? = null,
    val title: String,
    val description: String? = null,
    val location: String? = null,
    val startAt: String,
    val endAt: String,
    val allDay: Boolean = false,
    val status: String = "confirmed"
)

data class PlanState(
    val code: String = "free",
    val status: String = "active"
)
