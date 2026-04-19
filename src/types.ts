// Home Assistant types
export interface HassEntityAttributes {
  friendly_name?: string;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes?: Record<string, unknown>;
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>
  ): Promise<void>;
}

// Card config
export interface SpotifyBrowserCardConfig {
  spotify_entity?: string;
  default_device?: string;
  height?: number;
  sonos_coordinator_sensor?: string;
  sonos_entities?: string[];
}

// Spotify API types
export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  images?: SpotifyImage[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  uri: string;
  description: string;
  images: SpotifyImage[];
  tracks: { total: number };
  owner: { display_name: string };
}

export interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
  is_active: boolean;
  volume_percent: number | null;
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
  device: SpotifyDevice | null;
  volume: number;
}

export interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
  next: string | null;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  next: string | null;
}

export interface SpotifyRecentlyPlayedResponse {
  items: Array<{ track: SpotifyTrack; played_at: string }>;
  next: string | null;
}

export interface SpotifySearchResponse {
  tracks?: { items: SpotifyTrack[] };
  playlists?: { items: SpotifyPlaylist[] };
  artists?: { items: SpotifyArtist[] };
}

export interface SpotifyDevicesResponse {
  devices: SpotifyDevice[];
}

export type BrowseTab = 'playlists' | 'recently-played' | 'top-tracks' | 'search';
export type MainTab = 'now-playing' | 'browse';

export interface PlaybackRequest {
  context_uri?: string;
  uris?: string[];
  device_id?: string;
}
