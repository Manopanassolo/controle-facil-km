package br.com.controlefacil.km.core.rules

import br.com.controlefacil.km.core.model.Attachment

object AttachmentRules {
    fun validate(attachment: Attachment): Result<Unit> = runCatching {
        require(attachment.id.isNotBlank()) { "Comprovante sem identificador." }
        require(attachment.localUri.isNotBlank()) { "Comprovante sem arquivo local." }
        require(attachment.originalFilename.isNotBlank()) { "Comprovante sem nome de arquivo." }
        require(attachment.mimeType.isNotBlank()) { "Comprovante sem tipo MIME." }
        require(attachment.fileSizeBytes >= 0) { "Tamanho do comprovante inválido." }
        require((attachment.expenseId != null) xor (attachment.tripId != null)) {
            "O comprovante deve estar vinculado a uma despesa ou viagem."
        }
    }
}
