import * as WebBrowser from 'expo-web-browser';
import type { Session } from './api';

function env() {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase não configurado nesta instalação.');
  return { url: url.replace(/\/$/, ''), key };
}

async function parseResponse<T>(r: Response): Promise<T> {
  const text = await r.text();
  let data: unknown = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!r.ok) {
    const obj = data as Record<string, unknown> | null;
    throw new Error(String(obj?.message || obj?.error_description || obj?.error || `HTTP ${r.status}`));
  }
  return data as T;
}

export async function signInWithGoogle(): Promise<Session> {
  const { url, key } = env();
  const redirectTo = 'movvant://google-auth';
  const authorizeUrl = `${url}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}&prompt=consent`;
  WebBrowser.maybeCompleteAuthSession();
  const result = await WebBrowser.openAuthSessionAsync(authorizeUrl, redirectTo, { showInRecents: true });
  if (result.type !== 'success' || !('url' in result) || !result.url) {
    throw new Error(result.type === 'cancel' || result.type === 'dismiss' ? 'Login Google cancelado.' : 'Não foi possível concluir o login Google.');
  }
  const callback = new URL(result.url);
  const hash = new URLSearchParams(callback.hash.replace(/^#/, ''));
  const accessToken = hash.get('access_token') || callback.searchParams.get('access_token');
  const refreshToken = hash.get('refresh_token') || callback.searchParams.get('refresh_token') || undefined;
  const expiresIn = Number(hash.get('expires_in') || callback.searchParams.get('expires_in') || '3600');
  const tokenType = hash.get('token_type') || callback.searchParams.get('token_type') || 'bearer';
  const errorDescription = hash.get('error_description') || callback.searchParams.get('error_description');
  if (errorDescription) throw new Error(errorDescription);
  if (!accessToken) throw new Error('A autenticação Google não retornou a sessão ao Movvant.');

  const userResponse = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
  });
  const user = await parseResponse<Session['user']>(userResponse);
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expiresIn,
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    token_type: tokenType,
    user,
  };
}
