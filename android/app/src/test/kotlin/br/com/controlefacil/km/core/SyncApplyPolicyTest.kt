package br.com.controlefacil.km.sync

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class SyncApplyPolicyTest {
    data class Row(val id: String, val value: String)

    @Test
    fun uploadedNewRowIsRetainedAfterApplyingRemoteSnapshot() {
        val remote = listOf(Row("remote-1", "old"))
        val uploaded = listOf(Row("local-new", "new"))

        val result = SyncApplyPolicy.retainUploadedRows(remote, uploaded, Row::id)

        assertEquals(listOf("remote-1", "local-new"), result.map { it.id })
        assertTrue(result.any { it.id == "local-new" && it.value == "new" })
    }

    @Test
    fun uploadedUpdatedRowReplacesStaleRemoteSnapshot() {
        val remote = listOf(Row("row-1", "old"))
        val uploaded = listOf(Row("row-1", "updated"))

        val result = SyncApplyPolicy.retainUploadedRows(remote, uploaded, Row::id)

        assertEquals(1, result.size)
        assertEquals("updated", result.single().value)
    }

    @Test
    fun localConflictRowIsRetained() {
        val remote = listOf(Row("remote-1", "remote"))
        val conflict = SyncConflict(
            local = Row("conflict-1", "local"),
            remote = Row("conflict-1", "remote"),
            localVersion = 5,
            remoteVersion = 5,
            resolution = ConflictResolution.MERGE_REQUIRED
        )

        val result = SyncApplyPolicy.retainConflictRows(remote, listOf(conflict), Row::id)

        assertEquals(listOf("remote-1", "conflict-1"), result.map { it.id })
        assertEquals("local", result.last().value)
    }

    @Test
    fun multipleUploadedRowsAreAllRetained() {
        val remote = listOf(Row("remote-1", "remote"))
        val uploaded = listOf(
            Row("new-1", "one"),
            Row("new-2", "two"),
            Row("new-3", "three")
        )

        val result = SyncApplyPolicy.retainUploadedRows(remote, uploaded, Row::id)

        assertEquals(4, result.size)
        assertEquals(setOf("remote-1", "new-1", "new-2", "new-3"), result.map { it.id }.toSet())
    }
}
