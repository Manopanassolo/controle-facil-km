package br.com.controlefacil.km.auth

data class AuthUser(
    val id: String,
    val email: String?,
    val displayName: String?
)

sealed interface AuthState {
    data object Loading : AuthState
    data object SignedOut : AuthState
    data class SignedIn(val user: AuthUser) : AuthState
    data class Error(val message: String) : AuthState
}
