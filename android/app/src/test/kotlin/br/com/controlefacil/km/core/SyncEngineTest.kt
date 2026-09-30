package br.com.controlefacil.km.core

import br.com.controlefacil.km.sync.ConflictResolution
import br.com.controlefacil.km.sync.SyncConnectivity
import br.com.controlefacil.km.sync.SyncEngine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class SyncEngineTest {
    @Test fun offlineDoesNotSync() {
        val engine = SyncEngine(object : SyncConnectivity {
            override fun isOnline() = false
        })
        assertFalse(engine.shouldSync())
    }

    @Test fun onlineCanSync() {
        val engine = SyncEngine(object : SyncConnectivity {
            override fun isOnline() = true
        })
        assertTrue(engine.shouldSync())
    }

    @Test fun conflictDecisionIsVersionBased() {
        val engine = SyncEngine(object : SyncConnectivity {
            override fun isOnline() = true
        })
        assertEquals(ConflictResolution.KEEP_LOCAL, engine.mergeDecision(3, 2))
        assertEquals(ConflictResolution.KEEP_REMOTE, engine.mergeDecision(2, 3))
    }
}
