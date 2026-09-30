package br.com.controlefacil.km.core

import br.com.controlefacil.km.sync.ConflictResolution
import br.com.controlefacil.km.sync.ConflictResolver
import org.junit.Assert.assertEquals
import org.junit.Test

class SupabaseSyncPolicyTest {
    @Test fun equalVersionDifferentPayloadRequiresExplicitResolution() {
        assertEquals(ConflictResolution.MERGE_REQUIRED, ConflictResolver.resolve(4, 4))
    }

    @Test fun newerRemoteWins() {
        assertEquals(ConflictResolution.KEEP_REMOTE, ConflictResolver.resolve(2, 7))
    }

    @Test fun newerLocalWins() {
        assertEquals(ConflictResolution.KEEP_LOCAL, ConflictResolver.resolve(8, 3))
    }
}
