package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.model.Vehicle
import br.com.controlefacil.km.core.rules.VehicleSelectionRules
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class VehicleSelectionRulesTest {
    private val carro = Vehicle("v1", "Carro", isDefault = true)
    private val moto = Vehicle("v2", "Moto")
    private val inativo = Vehicle("v3", "Antigo", isActive = false)

    @Test fun selecionaVeiculoAtivoPeloId() {
        assertEquals(carro, VehicleSelectionRules.selectedVehicle(listOf(carro, moto), "v1"))
    }

    @Test fun naoSelecionaVeiculoInativo() {
        assertNull(VehicleSelectionRules.selectedVehicle(listOf(carro, inativo), "v3"))
    }

    @Test fun iniciaNoVeiculoPadrao() {
        assertEquals("v1", VehicleSelectionRules.initialSelection(listOf(carro, moto)))
    }

    @Test fun semVeiculosRetornaNulo() {
        assertNull(VehicleSelectionRules.initialSelection(emptyList()))
    }
}
