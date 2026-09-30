package br.com.controlefacil.km.sync

import br.com.controlefacil.km.core.model.Expense
import br.com.controlefacil.km.core.model.ExpensePayment
import org.junit.Assert.assertEquals
import org.junit.Test

class ExpenseSyncMapperTest {
    @Test
    fun mapsExpenseToRemoteWithStableCategoryId() {
        val expense = Expense(
            id = "expense-1",
            vehicleId = "vehicle-1",
            categoryId = "00000000-0000-0000-0000-000000000001",
            expenseDate = "2026-09-30",
            description = "Abastecimento",
            amountCents = 12345,
            odometerM = 1000,
            merchant = "Posto",
            paymentMethod = ExpensePayment.PIX,
            notes = "Teste"
        )

        val remote = LocalSyncMapper("user-1").expense(expense)

        assertEquals("expense-1", remote.id)
        assertEquals("user-1", remote.user_id)
        assertEquals(expense.categoryId, remote.category_id)
        assertEquals("pix", remote.payment_method)
        assertEquals(12345L, remote.amount_cents)
    }
}
