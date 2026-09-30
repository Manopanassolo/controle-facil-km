package br.com.controlefacil.km.core

import br.com.controlefacil.km.sync.ConflictResolution
import br.com.controlefacil.km.sync.ConflictResolver
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ConflictResolverTest {
    @Test fun newerLocalWins() {
        assertEquals(ConflictResolution.KEEP_LOCAL, ConflictResolver.resolve(5, 3))
    }

    @Test fun newerRemoteWins() {
        assertEquals(ConflictResolution.KEEP_REMOTE, ConflictResolver.resolve(3, 5))
    }

    @Test fun equalVersionsRequireMerge() {
        assertEquals(ConflictResolution.MERGE_REQUIRED, ConflictResolver.resolve(5, 5))
    }

    @Test fun chooseReturnsWinningRecord() {
        assertEquals("local", ConflictResolver.choose("local", "remote", 2, 1))
        assertEquals("remote", ConflictResolver.choose("local", "remote", 1, 2))
        assertNull(ConflictResolver.choose("local", "remote", 2, 2))
    }
}
