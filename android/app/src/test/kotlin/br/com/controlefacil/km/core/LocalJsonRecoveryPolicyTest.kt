package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.local.LocalJsonRecoveryPolicy
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class LocalJsonRecoveryPolicyTest {
    @Test
    fun validJsonIsReadWithoutRecovery() {
        val result = LocalJsonRecoveryPolicy.parse("""[{"id":"1"}]""")

        assertFalse(result.recovered)
        assertEquals(1, result.json.size)
        assertEquals("""{"id":"1"}""", result.json[0].toString())
    }

    @Test
    fun malformedJsonTriggersRecoveryWithoutThrowing() {
        val result = LocalJsonRecoveryPolicy.parse("""[{"id":""")

        assertTrue(result.recovered)
        assertEquals(0, result.json.length())
    }

    @Test
    fun missingValueUsesEmptyDocument() {
        val result = LocalJsonRecoveryPolicy.parse(null)

        assertFalse(result.recovered)
        assertEquals(0, result.json.length())
    }
}
