package br.com.controlefacil.km.sync

import kotlinx.serialization.Serializable

@Serializable
data class RemoteVehicle(
    val id: String,
    val user_id: String,
    val name: String,
    val brand: String? = null,
    val model: String? = null,
    val year: Int? = null,
    val plate: String? = null,
    val fuel_type: String = "flex",
    val initial_odometer_m: Long = 0,
    val current_odometer_m: Long = 0,
    val is_default: Boolean = false,
    val is_active: Boolean = true,
    val version: Int = 1,
    val updated_at: String? = null,
    val deleted_at: String? = null
)

@Serializable
data class RemoteTrip(
    val id: String,
    val user_id: String,
    val vehicle_id: String,
    val trip_date: String,
    val start_odometer_m: Long,
    val end_odometer_m: Long? = null,
    val origin: String? = null,
    val destination: String? = null,
    val trip_type: String = "personal",
    val purpose: String? = null,
    val notes: String? = null,
    val status: String = "draft",
    val version: Int = 1,
    val updated_at: String? = null,
    val deleted_at: String? = null
)

@Serializable
data class RemoteExpenseCategory(
    val id: String,
    val user_id: String,
    val name: String,
    val icon: String? = null,
    val color: String? = null,
    val sort_order: Int = 0,
    val is_system: Boolean = true,
    val is_active: Boolean = true,
    val version: Int = 1,
    val updated_at: String? = null,
    val deleted_at: String? = null
)

@Serializable
data class RemoteExpense(
    val id: String,
    val user_id: String,
    val vehicle_id: String,
    val category_id: String,
    val trip_id: String? = null,
    val expense_date: String,
    val description: String,
    val amount_cents: Long,
    val odometer_m: Long? = null,
    val merchant: String? = null,
    val payment_method: String? = null,
    val notes: String? = null,
    val version: Int = 1,
    val updated_at: String? = null,
    val deleted_at: String? = null
)


@Serializable
data class RemoteAttachment(
    val id: String,
    val user_id: String,
    val expense_id: String? = null,
    val trip_id: String? = null,
    val storage_path: String,
    val original_filename: String,
    val mime_type: String,
    val file_size_bytes: Long,
    val sha256: String? = null,
    val width: Int? = null,
    val height: Int? = null,
    val uploaded_at: String? = null,
    val version: Int = 1,
    val created_at: String? = null,
    val updated_at: String? = null,
    val deleted_at: String? = null
)
