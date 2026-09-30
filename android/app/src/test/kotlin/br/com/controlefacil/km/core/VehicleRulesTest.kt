package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.rules.VehicleRules
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class VehicleRulesTest {
    @Test fun rejeitaNomeVazio() {
        assertFalse(VehicleRules.validate("", "Fiat", "Argo", 2024, null, 0).valid)
    }

    @Test fun aceitaPlacaAntiga() {
        assertTrue(VehicleRules.validate("Meu carro", "Fiat", "Argo", 2024, "ABC-1234", 0).valid)
    }

    @Test fun aceitaPlacaMercosul() {
        assertTrue(VehicleRules.validate("Meu carro", "Fiat", "Argo", 2024, "ABC1D23", 0).valid)
    }

    @Test fun rejeitaPlacaInvalida() {
        assertFalse(VehicleRules.validate("Meu carro", null, null, null, "123-ABC", 0).valid)
    }

    @Test fun rejeitaAnoForaDaFaixa() {
        assertFalse(VehicleRules.validate("Meu carro", null, null, 1800, null, 0).valid)
    }

    @Test fun rejeitaKmInicialNegativo() {
        assertFalse(VehicleRules.validate("Meu carro", null, null, null, null, -1).valid)
    }

    @Test fun normalizaPlaca() {
        assertEquals("ABC1234", VehicleRules.normalizePlate("abc-1234"))
    }
}
