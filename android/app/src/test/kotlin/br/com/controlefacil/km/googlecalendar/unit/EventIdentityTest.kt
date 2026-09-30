package br.com.controlefacil.km.googlecalendar.unit

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

class EventIdentityTest {
    @Test
    fun sameGoogleEventIdMapsToSameLocalIdentity() {
        val first = EventIdentity("connection-001", "google-event-001")
        val second = EventIdentity("connection-001", "google-event-001")

        assertEquals(first, second)
    }

    @Test
    fun differentGoogleEventsRemainDistinct() {
        val first = EventIdentity("connection-001", "google-event-001")
        val second = EventIdentity("connection-001", "google-event-002")

        assertNotEquals(first, second)
    }

    @Test
    fun sameGoogleEventCanBeUpdatedWithoutChangingIdentity() {
        val before = GoogleCalendarEvent(
            identity = EventIdentity("connection-001", "google-event-001"),
            title = "Viagem",
        )
        val after = before.copy(title = "Viagem atualizada")

        assertEquals(before.identity, after.identity)
        assertEquals("Viagem atualizada", after.title)
    }

    @Test
    fun sameEventIsNotInsertedTwice() {
        val store = FakeEventStore()

        store.upsert(
            GoogleCalendarEvent(
                EventIdentity("connection-001", "google-event-001"),
                "Primeiro",
            ),
        )
        store.upsert(
            GoogleCalendarEvent(
                EventIdentity("connection-001", "google-event-001"),
                "Atualizado",
            ),
        )

        assertEquals(1, store.size())
        assertEquals("Atualizado", store.find(
            EventIdentity("connection-001", "google-event-001"),
        )?.title)
    }

    @Test
    fun sameGoogleEventInDifferentConnectionsRemainsDistinct() {
        val first = EventIdentity("connection-001", "google-event-001")
        val second = EventIdentity("connection-002", "google-event-001")

        assertNotEquals(first, second)
    }
}

private data class EventIdentity(
    val connectionId: String,
    val googleEventId: String,
)

private data class GoogleCalendarEvent(
    val identity: EventIdentity,
    val title: String,
)

private class FakeEventStore {
    private val events = mutableMapOf<EventIdentity, GoogleCalendarEvent>()

    fun upsert(event: GoogleCalendarEvent) {
        events[event.identity] = event
    }

    fun find(identity: EventIdentity): GoogleCalendarEvent? = events[identity]

    fun size(): Int = events.size
}
