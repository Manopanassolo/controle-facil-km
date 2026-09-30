package br.com.controlefacil.km.core

import br.com.controlefacil.km.sync.PendingSyncPolicy
import org.junit.Assert.assertEquals
import org.junit.Test

class PendingSyncStoreTest {
    @Test
    fun markPendingAddsRecordWithoutDuplicatingIt() {
        val once = PendingSyncPolicy.add(emptySet(), "trip-1")
        val twice = PendingSyncPolicy.add(once, "trip-1")

        assertEquals(setOf("trip-1"), twice)
    }

    @Test
    fun clearRemovesOnlyRequestedRecord() {
        val current = setOf("trip-1", "trip-2")

        val result = PendingSyncPolicy.remove(current, "trip-1")

        assertEquals(setOf("trip-2"), result)
    }

    @Test
    fun nullPreferenceValueBehavesAsEmptySet() {
        assertEquals(emptySet<String>(), PendingSyncPolicy.normalized(null))
    }

    @Test
    fun pendingRecordsAreIsolatedByRecordId() {
        val current = setOf("expense-1", "expense-2")

        assertEquals(setOf("expense-1", "expense-2"), PendingSyncPolicy.normalized(current))
    }
}
