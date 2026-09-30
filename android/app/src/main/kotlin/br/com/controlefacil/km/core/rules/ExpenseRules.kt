package br.com.controlefacil.km.core.rules

data class ExpenseValidation(
    val valid: Boolean,
    val message: String? = null
)

object ExpenseRules {
    fun validate(
        description: String,
        amountCents: Long,
        expenseDate: String,
        vehicleId: String
    ): ExpenseValidation {
        if (description.trim().isEmpty()) return ExpenseValidation(false, "Informe uma descrição para a despesa.")
        if (amountCents <= 0L) return ExpenseValidation(false, "Informe um valor maior que zero.")
        if (expenseDate.trim().isEmpty()) return ExpenseValidation(false, "Informe a data da despesa.")
        if (vehicleId.trim().isEmpty()) return ExpenseValidation(false, "Selecione um veículo.")
        return ExpenseValidation(true)
    }
}
