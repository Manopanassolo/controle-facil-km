import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_CALENDAR = "https://www.googleapis.com/calendar/v3";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
];

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const googleClientId = Deno.env.get("CFKM_GOOGLE_CLIENT_ID")!;
const googleClientSecret = Deno.env.get("CFKM_GOOGLE_CLIENT_SECRET")!;
const publicBaseUrl = Deno.env.get("CFKM_GOOGLE_CALLBACK_BASE_URL")!;
const appRedirectUri = Deno.env.get("CFKM_APP_REDIRECT_URI")!;

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function authUser(req: Request) {
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

async function exchangeCode(code: string, redirectUri: string) {
  const response = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!response.ok) throw new Error("google_token_exchange_failed");
  return await response.json();
}

async function refreshToken(refreshToken: string) {
  const response = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: googleClientId,
      client_secret: googleClientSecret,
      grant_type: "refresh_token",
    }),
  });
  if (!response.ok) throw new Error("google_token_refresh_failed");
  return await response.json();
}

async function googleRequest(url: string, accessToken: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Accept", "application/json");
  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`google_${response.status}:${body.slice(0, 300)}`);
  }
  return response;
}

async function getConnection(userId: string) {
  const { data, error } = await admin
    .from("calendar_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "google")
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getAccessToken(connection: any) {
  const { data: secret, error } = await admin
    .from("calendar_oauth_secrets")
    .select("*")
    .eq("connection_id", connection.id)
    .single();
  if (error) throw error;

  const expiresAt = secret.token_expires_at ? Date.parse(secret.token_expires_at) : 0;
  if (secret.access_token && expiresAt > Date.now() + 60_000) return secret.access_token;
  if (!secret.refresh_token) throw new Error("google_refresh_token_missing");

  const refreshed = await refreshToken(secret.refresh_token);
  const expires = new Date(Date.now() + Number(refreshed.expires_in ?? 3600) * 1000).toISOString();

  await admin.from("calendar_oauth_secrets").update({
    access_token: refreshed.access_token,
    token_expires_at: expires,
    token_type: refreshed.token_type ?? "Bearer",
  }).eq("connection_id", connection.id);

  return refreshed.access_token;
}

async function syncCalendar(userId: string, connection: any) {
  const accessToken = await getAccessToken(connection);
  let pageToken: string | undefined;
  let nextSyncToken: string | undefined = connection.next_sync_token ?? undefined;
  let imported = 0;
  let updated = 0;
  let removed = 0;

  do {
    const url = new URL(`${GOOGLE_CALENDAR}/calendars/${encodeURIComponent(connection.calendar_id)}/events`);
    url.searchParams.set("maxResults", "2500");
    url.searchParams.set("singleEvents", "true");
    url.searchParams.set("showDeleted", "true");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    if (nextSyncToken) url.searchParams.set("syncToken", nextSyncToken);

    let response: Response;
    try {
      response = await googleRequest(url.toString(), accessToken);
    } catch (e) {
      if (String(e).startsWith("google_410:")) {
        if (!connection.next_sync_token) throw e;
        await admin.from("calendar_events")
          .update({ deleted_at: new Date().toISOString() })
          .eq("connection_id", connection.id);
        return await syncCalendar(userId, { ...connection, next_sync_token: null });
      }
      throw e;
    }

    const payload = await response.json();
    for (const event of payload.items ?? []) {
      const googleId = event.id as string | undefined;
      if (!googleId) continue;

      if (event.status === "cancelled") {
        await admin.from("calendar_events")
          .update({ status: "cancelled", deleted_at: new Date().toISOString() })
          .eq("connection_id", connection.id)
          .eq("google_event_id", googleId);
        removed++;
        continue;
      }

      const start = event.start?.dateTime ?? (event.start?.date ? `${event.start.date}T00:00:00Z` : null);
      const end = event.end?.dateTime ?? (event.end?.date ? `${event.end.date}T00:00:00Z` : null);

      const row = {
        user_id: userId,
        connection_id: connection.id,
        google_event_id: googleId,
        google_etag: event.etag ?? null,
        title: event.summary ?? "(Sem título)",
        description: event.description ?? null,
        location: event.location ?? null,
        start_at: start,
        end_at: end,
        all_day: Boolean(event.start?.date),
        status: event.status ?? "confirmed",
        html_link: event.htmlLink ?? null,
        deleted_at: null,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await admin
        .from("calendar_events")
        .select("id")
        .eq("connection_id", connection.id)
        .eq("google_event_id", googleId)
        .maybeSingle();

      const { error } = await admin
        .from("calendar_events")
        .upsert(row, { onConflict: "connection_id,google_event_id" });
      if (error) throw error;

      if (existing?.id) updated++;
      else imported++;
    }

    pageToken = payload.nextPageToken;
    if (payload.nextSyncToken) nextSyncToken = payload.nextSyncToken;
  } while (pageToken);

  await admin.from("calendar_connections").update({
    next_sync_token: nextSyncToken ?? null,
    last_sync_at: new Date().toISOString(),
    sync_status: "synced",
    sync_error: null,
  }).eq("id", connection.id);

  return { imported, updated, removed };
}

async function startOAuth(userId: string) {
  const state = crypto.randomUUID();
  const stateHash = await sha256(state);
  const redirectUri = `${publicBaseUrl.replace(/\/$/, "")}/google-calendar`;

  await admin.from("calendar_oauth_states").insert({
    user_id: userId,
    state_hash: stateHash,
    redirect_uri: redirectUri,
    expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
  });

  const url = new URL(GOOGLE_AUTH);
  url.searchParams.set("client_id", googleClientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("scope", SCOPES.join(" "));
  url.searchParams.set("state", state);

  return json({ authorization_url: url.toString() });
}

async function callback(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) return new Response("OAuth inválido.", { status: 400 });

  const stateHash = await sha256(state);
  const { data: oauthState, error } = await admin
    .from("calendar_oauth_states")
    .select("*")
    .eq("state_hash", stateHash)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();
  if (error || !oauthState) return new Response("Estado OAuth inválido ou expirado.", { status: 400 });

  const tokens = await exchangeCode(code, oauthState.redirect_uri);
  if (!tokens.access_token) return new Response("Token OAuth ausente.", { status: 502 });

  const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const googleUser = googleUserResponse.ok ? await googleUserResponse.json() : {};

  const { data: connection, error: connectionError } = await admin
    .from("calendar_connections")
    .upsert({
      user_id: oauthState.user_id,
      provider: "google",
      google_account_email: googleUser.email ?? null,
      calendar_id: "primary",
      calendar_name: "Agenda principal",
      scope: SCOPES.join(" "),
      connected_at: new Date().toISOString(),
      revoked_at: null,
      sync_status: "idle",
    }, { onConflict: "user_id,provider" })
    .select()
    .single();
  if (connectionError) throw connectionError;

  await admin.from("calendar_oauth_secrets").upsert({
    connection_id: connection.id,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token ?? undefined,
    token_expires_at: new Date(Date.now() + Number(tokens.expires_in ?? 3600) * 1000).toISOString(),
    token_type: tokens.token_type ?? "Bearer",
  });

  await admin.from("calendar_oauth_states").update({ used_at: new Date().toISOString() }).eq("id", oauthState.id);

  const redirect = new URL(appRedirectUri);
  redirect.searchParams.set("status", "connected");
  return Response.redirect(redirect.toString(), 302);
}

async function listCalendars(userId: string) {
  const connection = await getConnection(userId);
  if (!connection) return json({ connected: false, calendars: [] });

  const token = await getAccessToken(connection);
  const response = await googleRequest(`${GOOGLE_CALENDAR}/users/me/calendarList?maxResults=250`, token);
  const payload = await response.json();

  return json({
    connected: true,
    selected_calendar_id: connection.calendar_id,
    calendars: (payload.items ?? []).map((calendar: any) => ({
      id: calendar.id,
      name: calendar.summary,
      timezone: calendar.timeZone,
      access_role: calendar.accessRole,
      primary: Boolean(calendar.primary),
    })),
  });
}

async function selectCalendar(userId: string, calendarId: string) {
  const connection = await getConnection(userId);
  if (!connection) return json({ error: "not_connected" }, 409);

  const token = await getAccessToken(connection);
  const response = await googleRequest(
    `${GOOGLE_CALENDAR}/users/me/calendarList/${encodeURIComponent(calendarId)}`,
    token,
  );
  const calendar = await response.json();

  if (!["owner", "writer"].includes(calendar.accessRole)) {
    return json({ error: "calendar_not_writable" }, 403);
  }

  await admin.from("calendar_connections").update({
    calendar_id: calendar.id,
    calendar_name: calendar.summary,
    timezone: calendar.timeZone,
    next_sync_token: null,
    sync_status: "idle",
    sync_error: null,
  }).eq("id", connection.id);

  await admin.from("calendar_events").delete().eq("connection_id", connection.id);

  return json({ selected: true, calendar_id: calendar.id, calendar_name: calendar.summary });
}

async function disconnect(userId: string) {
  const connection = await getConnection(userId);
  if (!connection) return json({ connected: false });

  await admin.from("calendar_connections").update({
    sync_status: "revoked",
    revoked_at: new Date().toISOString(),
  }).eq("id", connection.id);

  await admin.from("calendar_oauth_secrets").delete().eq("connection_id", connection.id);
  return json({ connected: false });
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);

    if (req.method === "GET" && url.searchParams.has("code") && url.searchParams.has("state")) {
      return await callback(req);
    }

    const user = await authUser(req);
    if (!user) return json({ error: "unauthorized" }, 401);

    if (req.method === "GET" && url.searchParams.get("action") === "connect") {
      return await startOAuth(user.id);
    }

    if (req.method === "GET" && url.searchParams.get("action") === "calendars") {
      return await listCalendars(user.id);
    }

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body.action === "select_calendar") return await selectCalendar(user.id, body.calendar_id);
      if (body.action === "sync") {
        const connection = await getConnection(user.id);
        if (!connection) return json({ error: "not_connected" }, 409);
        await admin.from("calendar_connections").update({ sync_status: "syncing", sync_error: null }).eq("id", connection.id);
        try {
          return json({ ok: true, result: await syncCalendar(user.id, connection) });
        } catch (e) {
          await admin.from("calendar_connections").update({ sync_status: "error", sync_error: String(e) }).eq("id", connection.id);
          throw e;
        }
      }
      if (body.action === "disconnect") return await disconnect(user.id);
    }

    return json({ error: "unsupported_operation" }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: String(error) }, 500);
  }
});
