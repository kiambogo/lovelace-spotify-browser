import type {
  HomeAssistant,
  SpotifyPlaybackState,
  SpotifyPlaylistsResponse,
  SpotifyTopTracksResponse,
  SpotifyRecentlyPlayedResponse,
  SpotifySearchResponse,
  SpotifyDevicesResponse,
  PlaybackRequest,
} from './types.js';

const BASE_URL = 'https://api.spotify.com/v1';

export class SpotifyApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'SpotifyApiError';
  }
}

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TokenError';
  }
}

function isBearerToken(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  // Bearer tokens are typically long alphanumeric strings
  return value.length > 20 && /^[A-Za-z0-9\-_=]+$/.test(value);
}

export function getToken(hass: HomeAssistant, spotifyEntity: string): string {
  const entity = hass.states[spotifyEntity];
  if (!entity) {
    throw new TokenError(
      `Entity "${spotifyEntity}" not found. Check your spotify_entity config.`
    );
  }

  const attrs = entity.attributes;

  // Primary: access_token attribute
  if (isBearerToken(attrs.access_token)) {
    return attrs.access_token as string;
  }

  // Fallback: media_content_id sometimes carries the token in some HA builds
  if (isBearerToken(attrs.media_content_id)) {
    return attrs.media_content_id as string;
  }

  throw new TokenError(
    'Could not read Spotify token from entity. Check your spotify_entity config.'
  );
}

async function request<T>(
  method: string,
  path: string,
  token: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const resp = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (resp.status === 204) {
    return undefined as unknown as T;
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => resp.statusText);
    throw new SpotifyApiError(resp.status, `Spotify API error ${resp.status}: ${text}`);
  }

  return resp.json() as Promise<T>;
}

export async function getPlaybackState(
  hass: HomeAssistant,
  spotifyEntity: string
): Promise<SpotifyPlaybackState | null> {
  const token = getToken(hass, spotifyEntity);
  try {
    const data = await request<SpotifyPlaybackState | null>('GET', '/me/player', token);
    return data;
  } catch (err) {
    if (err instanceof SpotifyApiError && err.status === 204) return null;
    throw err;
  }
}

export async function getPlaylists(
  hass: HomeAssistant,
  spotifyEntity: string,
  limit = 50
): Promise<SpotifyPlaylistsResponse> {
  const token = getToken(hass, spotifyEntity);
  return request<SpotifyPlaylistsResponse>(
    'GET',
    `/me/playlists?limit=${limit}`,
    token
  );
}

export async function getTopTracks(
  hass: HomeAssistant,
  spotifyEntity: string,
  limit = 50
): Promise<SpotifyTopTracksResponse> {
  const token = getToken(hass, spotifyEntity);
  return request<SpotifyTopTracksResponse>(
    'GET',
    `/me/top/tracks?limit=${limit}`,
    token
  );
}

export async function getRecentlyPlayed(
  hass: HomeAssistant,
  spotifyEntity: string,
  limit = 50
): Promise<SpotifyRecentlyPlayedResponse> {
  const token = getToken(hass, spotifyEntity);
  return request<SpotifyRecentlyPlayedResponse>(
    'GET',
    `/me/player/recently-played?limit=${limit}`,
    token
  );
}

export async function search(
  hass: HomeAssistant,
  spotifyEntity: string,
  query: string,
  limit = 20
): Promise<SpotifySearchResponse> {
  const token = getToken(hass, spotifyEntity);
  const encoded = encodeURIComponent(query);
  return request<SpotifySearchResponse>(
    'GET',
    `/search?q=${encoded}&type=track,album,artist,playlist&limit=${limit}`,
    token
  );
}

export async function getDevices(
  hass: HomeAssistant,
  spotifyEntity: string
): Promise<SpotifyDevicesResponse> {
  const token = getToken(hass, spotifyEntity);
  return request<SpotifyDevicesResponse>('GET', '/me/player/devices', token);
}

export async function play(
  hass: HomeAssistant,
  spotifyEntity: string,
  payload: PlaybackRequest
): Promise<void> {
  const token = getToken(hass, spotifyEntity);
  const path = payload.device_id
    ? `/me/player/play?device_id=${encodeURIComponent(payload.device_id)}`
    : '/me/player/play';
  const body: Record<string, unknown> = {};
  if (payload.context_uri) body['context_uri'] = payload.context_uri;
  if (payload.uris) body['uris'] = payload.uris;
  await request<void>('PUT', path, token, body);
}

export async function pause(
  hass: HomeAssistant,
  spotifyEntity: string
): Promise<void> {
  const token = getToken(hass, spotifyEntity);
  await request<void>('PUT', '/me/player/pause', token);
}

export async function next(
  hass: HomeAssistant,
  spotifyEntity: string
): Promise<void> {
  const token = getToken(hass, spotifyEntity);
  await request<void>('POST', '/me/player/next', token);
}

export async function previous(
  hass: HomeAssistant,
  spotifyEntity: string
): Promise<void> {
  const token = getToken(hass, spotifyEntity);
  await request<void>('POST', '/me/player/previous', token);
}

export async function setVolume(
  hass: HomeAssistant,
  spotifyEntity: string,
  volumePercent: number
): Promise<void> {
  const token = getToken(hass, spotifyEntity);
  await request<void>(
    'PUT',
    `/me/player/volume?volume_percent=${Math.round(volumePercent)}`,
    token
  );
}

export async function seek(
  hass: HomeAssistant,
  spotifyEntity: string,
  positionMs: number
): Promise<void> {
  const token = getToken(hass, spotifyEntity);
  await request<void>(
    'PUT',
    `/me/player/seek?position_ms=${Math.round(positionMs)}`,
    token
  );
}
