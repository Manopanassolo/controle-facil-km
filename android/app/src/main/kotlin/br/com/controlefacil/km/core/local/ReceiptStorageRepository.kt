package br.com.controlefacil.km.core.local

import android.content.Context
import android.webkit.MimeTypeMap
import br.com.controlefacil.km.auth.SupabaseClientProvider
import br.com.controlefacil.km.core.model.Attachment
import br.com.controlefacil.km.core.model.AttachmentSyncState
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.storage.storage
import java.security.MessageDigest
import java.time.Instant
import java.util.Locale

class ReceiptStorageRepository(private val context: Context) {
    private val client = SupabaseClientProvider.client

    suspend fun upload(attachment: Attachment): Result<Attachment> = runCatching {
        val user = requireNotNull(client.auth.currentUserOrNull()) { "Usuário não autenticado." }
        if (attachment.storagePath != null) return@runCatching attachment.copy(state = AttachmentSyncState.SYNCED, error = null)
        require(attachment.expenseId != null || attachment.tripId != null) { "Comprovante sem viagem ou despesa vinculada." }

        val bytes = if (attachment.localUri.startsWith("file://")) {
            java.io.File(android.net.Uri.parse(attachment.localUri).path!!).readBytes()
        } else {
            context.contentResolver.openInputStream(android.net.Uri.parse(attachment.localUri))
                ?.use { it.readBytes() }
        } ?: error("Não foi possível ler o comprovante local.")

        require(bytes.isNotEmpty()) { "O comprovante está vazio." }

        val extension = MimeTypeMap.getSingleton()
            .getExtensionFromMimeType(attachment.mimeType.lowercase(Locale.ROOT))
            ?.lowercase(Locale.ROOT)
            ?: attachment.originalFilename.substringAfterLast('.', "").lowercase(Locale.ROOT).ifBlank { "bin" }

        val ownerFolder = user.id
        val recordFolder = attachment.expenseId ?: attachment.tripId!!
        val path = ownerFolder + "/" + recordFolder + "/" + attachment.id + "." + extension

        client.storage.from("receipts").upload(path, bytes) {
            upsert = false
        }

        attachment.copy(
            storagePath = path,
            sha256 = sha256(bytes),
            uploadedAt = Instant.now().toString(),
            state = AttachmentSyncState.SYNCED,
            error = null,
            fileSizeBytes = bytes.size.toLong()
        )
    }

    private fun sha256(bytes: ByteArray): String =
        MessageDigest.getInstance("SHA-256").digest(bytes).joinToString("") { "%02x".format(it) }
}
