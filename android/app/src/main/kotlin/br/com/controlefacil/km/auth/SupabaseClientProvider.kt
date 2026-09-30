package br.com.controlefacil.km.auth

import br.com.controlefacil.km.BuildConfig
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.FlowType
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.createSupabaseClient

object SupabaseClientProvider {
    val client = createSupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_PUBLISHABLE_KEY
    ) {
        install(Auth) {
            flowType = FlowType.PKCE
            scheme = "controlefacilkm"
            host = "auth"
        }
        install(Postgrest)
        install(Storage)
    }
}
