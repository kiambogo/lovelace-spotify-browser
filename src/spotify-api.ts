import type { HomeAssistant } from './types.js';

export class SpotifyApi {
  private _hass: HomeAssistant;

  constructor(hass: HomeAssistant) {
    this._hass = hass;
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: Record<string, unknown>,
    params?: Record<string, string | number>
  ): Promise<T> {
    return this._hass.callWS<T>({
      type: 'lovelace_spotify_browser/request',
      method,
      endpoint,
      ...(body ? { body } : {}),
      ...(params ? { params } : {}),
    });
  }

  async getPlaylists() {
    return this.request<SpotifyApi.PlaylistsResponse>('GET', '/me/playlists', undefined, { limit: 50 });
  }

  async getRecentlyPlayed() {
    return this.request<SpotifyApi.RecentlyPlayedResponse>('GET', '/me/player/recently-played', undefined, { limit: 50 });
  }

  async getTopTracks() {
    return this.request<SpotifyApi.TopTracksResponse>('GET', '/me/top/tracks', undefined, { limit: 50 });
  }

  async search(query: string) {
    return this.request<SpotifyApi.SearchResponse>('GET', '/search', undefined, {
      q: query,
      type: 'track,playlist,album,artist',
      limit: 20,
    });
  }

  async getDevices() {
    return this.request<SpotifyApi.DevicesResponse>('GET', '/me/player/devices');
  }

  async getCurrentPlayback() {
    return this.request<SpotifyApi.PlaybackState | null>('GET', '/me/player');
  }

  async play(deviceId?: string, contextUri?: string, uris?: string[]) {
    const params = deviceId ? { device_id: deviceId } : undefined;
    const body: Record<string, unknown> = {};
    if (contextUri) body['context_uri'] = contextUri;
    if (uris) body['uris'] = uris;
    return this.request('PUT', '/me/player/play', Object.keys(body).length ? body : undefined, params);
  }

  async pause() {
    return this.request('PUT', '/me/player/pause');
  }

  async next() {
    return this.request('POST', '/me/player/next');
  }

  async previous() {
    return this.request('POST', '/me/player/previous');
  }

  async setVolume(volumePercent: number) {
    return this.request('PUT', '/me/player/volume', undefined, { volume_percent: volumePercent });
  }

  async seek(positionMs: number) {
    return this.request('PUT', '/me/player/seek', undefined, { position_ms: positionMs });
  }
}

export namespace SpotifyApi {
  export interface PlaylistsResponse {
    items: Playlist[];
    total: number;
  }
  export interface Playlist {
    id: string;
    name: string;
    uri: string;
    images: Image[];
    tracks: { total: number };
    owner: { display_name: string };
  }
  export interface RecentlyPlayedResponse {
    items: Array<{ track: Track; played_at: string }>;
  }
  export interface TopTracksResponse {
    items: Track[];
  }
  export interface SearchResponse {
    tracks?: { items: Track[] };
    playlists?: { items: Playlist[] };
  }
  export interface DevicesResponse {
    devices: Device[];
  }
  export interface Device {
    id: string;
    name: string;
    type: string;
    is_active: boolean;
    volume_percent: number;
  }
  export interface PlaybackState {
    is_playing: boolean;
    progress_ms: number;
    item: Track | null;
    device: Device;
  }
  export interface Track {
    id: string;
    name: string;
    uri: string;
    duration_ms: number;
    artists: Array<{ name: string }>;
    album: { name: string; images: Image[] };
  }
  export interface Image {
    url: string;
    width: number;
    height: number;
  }
}
