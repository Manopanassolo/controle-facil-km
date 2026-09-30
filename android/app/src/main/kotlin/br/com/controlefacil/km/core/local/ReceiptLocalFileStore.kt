package br.com.controlefacil.km.core.local

import android.content.Context
import android.net.Uri
import android.provider.OpenableColumns
import java.io.File
import java.io.FileOutputStream
import java.util.UUID

data class StoredReceipt(
    val localUri: String,
    val originalFilename: String,
    val mimeType: String,
    val fileSizeBytes: Long
)

object ReceiptLocalFileStore {
    private const val DIRECTORY = "receipts"

    fun copyToPrivateStorage(context: Context, source: Uri): Result<StoredReceipt> = runCatching {
        val resolver = context.contentResolver
        val filename = resolver.query(
            source,
            arrayOf(OpenableColumns.DISPLAY_NAME),
            null,
            null,
            null
        )?.use { cursor ->
            if (cursor.moveToFirst()) cursor.getString(0) else null
        }.orEmpty().ifBlank { "comprovante" }

        val mimeType = resolver.getType(source).orEmpty().ifBlank {
            "application/octet-stream"
        }

        val directory = File(context.filesDir, DIRECTORY).apply { mkdirs() }
        val extension = filename.substringAfterLast('.', "").takeIf { it.isNotBlank() }
            ?: mimeType.substringAfterLast('/', "bin")
        val target = File(directory, UUID.randomUUID().toString() + "." + extension)

        resolver.openInputStream(source)?.use { input ->
            FileOutputStream(target).use { output ->
                input.copyTo(output)
            }
        } ?: error("Não foi possível ler o comprovante selecionado.")

        require(target.length() > 0L) { "O comprovante selecionado está vazio." }

        StoredReceipt(
            localUri = target.toURI().toString(),
            originalFilename = filename,
            mimeType = mimeType,
            fileSizeBytes = target.length()
        )
    }
}
