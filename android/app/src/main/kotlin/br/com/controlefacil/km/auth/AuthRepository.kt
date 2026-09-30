package br.com.controlefacil.km.auth

interface AuthRepository {
    suspend fun signIn(email: String, password: String): Result<AuthUser>
    suspend fun signUp(email: String, password: String, displayName: String? = null): Result<AuthUser?>
    suspend fun signInWithGoogle(): Result<Unit>
    suspend fun signOut(): Result<Unit>
    suspend fun currentUser(): AuthUser?
}
