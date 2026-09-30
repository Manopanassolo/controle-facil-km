package br.com.controlefacil.km

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import br.com.controlefacil.km.ui.ControleFacilApp
import br.com.controlefacil.km.auth.SupabaseClientProvider
import br.com.controlefacil.km.sync.SyncScheduler
import br.com.controlefacil.km.ui.theme.ControleFacilTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        SupabaseClientProvider.client.handleDeeplinks(intent)
        SyncScheduler.schedule(this)
        setContent {
            ControleFacilTheme {
                ControleFacilApp()
            }
        }
    }
}
