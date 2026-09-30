package br.com.controlefacil.km.sync

interface SyncConnectivity {
    fun isOnline(): Boolean
}

class AlwaysOnlineConnectivity : SyncConnectivity {
    override fun isOnline(): Boolean = true
}
