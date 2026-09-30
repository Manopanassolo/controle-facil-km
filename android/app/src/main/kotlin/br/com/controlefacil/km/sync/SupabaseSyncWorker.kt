package br.com.controlefacil.km.sync

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import br.com.controlefacil.km.auth.SupabaseClientProvider
import br.com.controlefacil.km.core.local.ExpenseCategoryLocalRepository
import br.com.controlefacil.km.core.local.ExpenseLocalRepository
import br.com.controlefacil.km.core.local.TripLocalRepository
import br.com.controlefacil.km.core.local.VehicleLocalRepository
import java.util.concurrent.TimeUnit

class SupabaseSyncWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val context = applicationContext
        if (!AndroidConnectivity(context).isOnline()) return Result.retry()
        if (SupabaseClientProvider.client.auth.currentUserOrNull() == null) return Result.success()

        val result = LocalSyncCoordinator(
            connectivity = AndroidConnectivity(context),
            authUserId = { SupabaseClientProvider.client.auth.currentUserOrNull()?.id },
            vehicles = VehicleLocalRepository(context),
            trips = TripLocalRepository(context),
            categories = ExpenseCategoryLocalRepository(context),
            expenses = ExpenseLocalRepository(context),
            remote = SupabaseSyncRepository(SupabaseClientProvider.client)
        ).run()

        return result.fold(
            onSuccess = { Result.success() },
            onFailure = { Result.retry() }
        )
    }
}

object SyncScheduler {
    private const val UNIQUE_WORK = "controle_facil_km_supabase_sync"

    fun schedule(context: Context) {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .build()

        val request = PeriodicWorkRequestBuilder<SupabaseSyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            UNIQUE_WORK,
            ExistingPeriodicWorkPolicy.KEEP,
            request
        )
    }
}
