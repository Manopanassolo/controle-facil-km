package br.com.controlefacil.km.core.model

data class ExpenseCategory(
    val id: String,
    val name: String,
    val icon: String? = null,
    val color: String? = null,
    val sortOrder: Int = 0,
    val isSystem: Boolean = true,
    val isActive: Boolean = true
)
