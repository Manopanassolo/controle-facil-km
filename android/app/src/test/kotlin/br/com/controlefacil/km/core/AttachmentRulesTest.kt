package br.com.controlefacil.km.core

import br.com.controlefacil.km.core.model.Attachment
import br.com.controlefacil.km.core.rules.AttachmentRules
import kotlin.test.Test
import kotlin.test.assertFails

class AttachmentRulesTest {
    private fun valid() = Attachment(
        id = "att-1",
        expenseId = "expense-1",
        localUri = "content://provider/document/1",
        originalFilename = "comprovante.pdf",
        mimeType = "application/pdf",
        fileSizeBytes = 100
    )

    @Test
    fun validAttachmentIsAccepted() {
        check(AttachmentRules.validate(valid()).isSuccess)
    }

    @Test
    fun attachmentWithoutOwnerIsRejected() {
        val result = AttachmentRules.validate(valid().copy(expenseId = null, tripId = null))
        check(result.isFailure)
    }

    @Test
    fun attachmentWithTwoOwnersIsRejected() {
        val result = AttachmentRules.validate(valid().copy(tripId = "trip-1"))
        check(result.isFailure)
    }

    @Test
    fun attachmentWithoutLocalUriIsRejected() {
        val result = AttachmentRules.validate(valid().copy(localUri = ""))
        check(result.isFailure)
    }
}
