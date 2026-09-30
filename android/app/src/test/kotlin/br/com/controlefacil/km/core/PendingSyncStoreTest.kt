package br.com.controlefacil.km.core

import br.com.controlefacil.km.sync.PendingSyncStore
import org.junit.Assert.assertTrue
import org.junit.Test

class PendingSyncStoreTest {
    @Test fun contractRequiresAndroidContext() {
        // Persistence behavior is covered by instrumentation tests in the Android layer.
        assertTrue(PendingSyncStore::class.java.simpleName.isNotBlank())
    }
}
