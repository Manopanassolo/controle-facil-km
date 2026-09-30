package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.rules.ExpenseRules
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class ExpenseRulesTest {
    @Test fun rejectsEmptyDescription() {
        assertFalse(ExpenseRules.validate("", 1000L, "2026-09-30", "vehicle").valid)
    }

    @Test fun rejectsZeroValue() {
        assertFalse(ExpenseRules.validate("Combustível", 0L, "2026-09-30", "vehicle").valid)
    }

    @Test fun rejectsNegativeValue() {
        assertFalse(ExpenseRules.validate("Combustível", -1L, "2026-09-30", "vehicle").valid)
    }

    @Test fun rejectsMissingVehicle() {
        assertFalse(ExpenseRules.validate("Combustível", 1000L, "2026-09-30", "").valid)
    }

    @Test fun acceptsValidExpense() {
        assertTrue(ExpenseRules.validate("Combustível", 12590L, "2026-09-30", "vehicle").valid)
    }
}
