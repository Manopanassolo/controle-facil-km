package br.com.controlefacil.km.navigation

sealed class AppRoute(val value: String) {
    data object Home : AppRoute("home")
    data object Trips : AppRoute("trips")
    data object NewTrip : AppRoute("trips/new")
    data class TripDetail(val id: String) : AppRoute("trips/{id}")
    data object Expenses : AppRoute("expenses")
    data object NewExpense : AppRoute("expenses/new")
    data object Calendar : AppRoute("calendar")
    data object Reports : AppRoute("reports")
    data object Vehicles : AppRoute("vehicles")
    data object Settings : AppRoute("settings")
    data object Plans : AppRoute("plans")
    data object Auth : AppRoute("auth")
    data object Onboarding : AppRoute("onboarding")
}
