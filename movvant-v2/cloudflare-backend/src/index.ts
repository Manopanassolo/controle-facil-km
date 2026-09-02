export interface Env {
  DB: D1Database;
  FILES: R2Bucket;
  APP_ENV: string;
  ALLOWED_ORIGIN: string;
}

function json(data: unknown, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(origin ? { "access-control-allow-origin": origin, vary: "Origin" } : {}),
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") === env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : "";

    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
          "access-control-allow-headers": "authorization,content-type",
          "access-control-max-age": "86400",
          vary: "Origin",
        },
      });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "movvant-v2-api", env: env.APP_ENV }, 200, origin);
    }

    // No data endpoints are exposed until authentication is connected.
    return json({ error: "not_found" }, 404, origin);
  },
};
