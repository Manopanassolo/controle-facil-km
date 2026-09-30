package br.com.controlefacil.km.auth

import io.github.jan.supabase.auth.providers.Google
import io.github.jan.supabase.auth.providers.Email

class SupabaseAuthRepository(
    private val client: io.github.jan.supabase.SupabaseClient = SupabaseClientProvider.client
) : AuthRepository {

    override suspend fun signIn(email: String, password: String): Result<AuthUser> = runCatching {
        client.auth.signInWith(Email) {
            this.email = email.trim()
            this.password = password
        }
        requireNotNull(client.auth.currentUserOrNull()).toAuthUser()
    }

    override suspend fun signUp(
        email: String,
        password: String,
        displayName: String?
    ): Result<AuthUser?> = runCatching {
        client.auth.signUpWith(Email) {
            this.email = email.trim()
            this.password = password
            if (!displayName.isNullOrBlank()) {
                data = kotlinx.serialization.json.buildJsonObject {
                    put("display_name", displayName.trim())
                }
            }
        }
        client.auth.currentUserOrNull()?.toAuthUser()
    }

    override suspend fun signInWithGoogle(): Result<Unit> = runCatching {
        client.auth.signInWith(Google)
    }

    override suspend fun signOut(): Result<Unit> = runCatching {
        client.auth.signOut()
    }

    override suspend fun currentUser(): AuthUser? =
        client.auth.currentUserOrNull()?.toAuthUser()

    private fun io.github.jan.supabase.auth.user.UserInfo.toAuthUser(): AuthUser =
        AuthUser(
            id = id,
            email = email,
            displayName = userMetadata?.get("display_name")?.toString()?.trim('"')
        )
}
