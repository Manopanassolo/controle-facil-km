package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.rules.TripRules
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TripRulesTest {

    @Test
    fun aceitaQuilometragemValida() {
        val resultado = TripRules.validateOdometers(1000L, 1250L)

        assertTrue(resultado.valid)
        assertEquals(250L, TripRules.distanceKm(1000L, 1250L))
    }

    @Test
    fun rejeitaKmFinalMenorQueInicial() {
        val resultado = TripRules.validateOdometers(1250L, 1000L)

        assertFalse(resultado.valid)
    }

    @Test
    fun aceitaViagemAindaSemKmFinal() {
        val resultado = TripRules.validateOdometers(1250L, null)

        assertTrue(resultado.valid)
    }

    @Test
    fun rejeitaKmInicialNegativo() {
        val resultado = TripRules.validateOdometers(-1L, 100L)

        assertFalse(resultado.valid)
    }
}
