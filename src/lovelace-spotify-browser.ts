import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  SpotifyBrowserCardConfig,
} from './types.js';
import { SpotifyApi } from './spotify-api.js';

import './components/now-playing.js';
import './components/browse-panel.js';

const SONOS_COORDINATOR_SENSOR = 'sensor.sonos_active_coordinator';
const SONOS_ENTITIES = [
  'media_player.kitchen',
  'media_player.sonos_move',
  'media_player.living_room',
  'media_player.garage',
  'media_player.patio',
];

@customElement('lovelace-spotify-browser')
export class SpotifyBrowserCard extends LitElement {
  @state() private _config: SpotifyBrowserCardConfig | null = null;
  @state() private _playbackState: SpotifyApi.PlaybackState | null = null;
  @state() private _progressMs = 0;
  @state() private _view: 'now-playing' | 'browse' = 'now-playing';
  @state() private _error = '';
  @state() private _pendingAlbumDrill: SpotifyApi.Album | null = null;

  private _hass: HomeAssistant | null = null;
  private _api: SpotifyApi | null = null;
  private _pollInterval: ReturnType<typeof setInterval> | null = null;
  private _progressInterval: ReturnType<typeof setInterval> | null = null;
  private _progressBaseMs = 0;
  private _progressBaseTime = 0;
  private _progressTrackId = '';

  static styles = css`
    :host { display: block; }

    ha-card {
      overflow: hidden;
      background: #0a0a0a;
      padding: 0 !important;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      height: var(--spotify-card-height, 500px);
      overflow: hidden;
      padding: 0;
    }

    .panel {
      flex: 1;
      overflow: hidden;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      gap: 12px;
      padding: 24px;
      text-align: center;
      color: #f44336;
      background: #0a0a0a;
    }
    .error-icon { font-size: 36px; }
    .error-msg { font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.6); }

    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  setConfig(config: SpotifyBrowserCardConfig) {
    this._config = config;
    this.style.setProperty('--spotify-card-height', `${config.height ?? 500}px`);
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    if (!this._api) {
      this._api = new SpotifyApi(hass);
    } else {
      this._api.hass = hass;
    }
  }

  static getConfigElement(): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = `<p style="padding:8px;font-size:13px;">Edit config YAML directly.</p>`;
    return el;
  }

  static getStubConfig(): SpotifyBrowserCardConfig {
    return {};
  }

  connectedCallback() {
    super.connectedCallback();
    this._startPolling();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPolling();
  }

  private _startPolling() {
    this._fetchState();
    this._pollInterval = setInterval(() => this._fetchState(), 5000);
    this._progressInterval = setInterval(() => {
      if (this._playbackState?.is_playing) {
        const elapsed = Date.now() - this._progressBaseTime;
        const duration = this._playbackState.item?.duration_ms ?? 0;
        this._progressMs = Math.min(this._progressBaseMs + elapsed, duration);
      }
    }, 1000);
  }

  private _stopPolling() {
    if (this._pollInterval !== null) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
    if (this._progressInterval !== null) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
  }

  private async _fetchState() {
    if (!this._api) return;
    try {
      this._error = '';
      const raw = await this._api.getCurrentPlayback();
      // 204 No Content comes back as {} — treat as no active session
      let state: SpotifyApi.PlaybackState | null = (raw && (raw as any).item) ? raw : null;
      if (state) {
        (state as any)._fromSpotify = true;
        this._playbackState = state;
      } else {
        // Don't overwrite a live Sonos fallback with null — only clear if we get a real Spotify response
        const fallback = this._sonosFallbackState();
        this._playbackState = fallback ?? null;
      }
      const newTrackId = this._playbackState?.item?.id ?? this._playbackState?.item?.name ?? '';
      const newProgressMs = this._playbackState?.progress_ms ?? 0;
      const trackChanged = newTrackId !== this._progressTrackId;
      // Only re-anchor progress when the track changes or a seek moved us more than 3s from our estimate
      const drift = Math.abs(newProgressMs - this._progressMs);
      if (trackChanged || drift > 3000) {
        this._progressBaseMs = newProgressMs;
        this._progressBaseTime = Date.now();
        this._progressMs = newProgressMs;
        this._progressTrackId = newTrackId;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('token_expired') || msg.includes('401')) {
        this._error = 'Spotify token expired. Re-authenticate in Home Assistant.';
      } else if (msg.includes('no_spotify_entry')) {
        this._error = 'Spotify integration not configured.';
      }
    }
  }

  private _sonosFallbackState(): SpotifyApi.PlaybackState | null {
    const coordinator = this._sonosCoordinator();
    if (!coordinator || !this._hass) return null;
    const entity = this._hass.states[coordinator];
    if (!entity || !['playing', 'paused'].includes(entity.state)) return null;
    const attr = entity.attributes as any;
    const title = attr.media_title;
    const artist = attr.media_artist;
    const duration = attr.media_duration ? Math.round(attr.media_duration * 1000) : 0;
    const position = attr.media_position ? Math.round(attr.media_position * 1000) : 0;
    const imageUrl = attr.entity_picture
      ? (attr.entity_picture.startsWith('http') ? attr.entity_picture : `${window.location.origin}${attr.entity_picture}`)
      : null;
    if (!title) return null;
    return {
      is_playing: entity.state === 'playing',
      progress_ms: position,
      item: {
        id: '',
        name: title,
        uri: '',
        duration_ms: duration,
        artists: artist ? [{ id: '', name: artist, uri: '' }] : [],
        album: { id: '', name: '', uri: '', images: imageUrl ? [{ url: imageUrl, width: 300, height: 300 }] : [], artists: [] },
      },
      device: { id: '', name: coordinator, type: 'Speaker', is_active: true, volume_percent: attr.volume_level ? Math.round(attr.volume_level * 100) : 50 },
      shuffle_state: attr.shuffle ?? false,
      repeat_state: attr.repeat ?? 'off',
      context: null,
    };
  }

  private _onPlaybackChanged() {
    // Spotify state API can lag after triggering playback — retry a few times
    setTimeout(() => this._fetchState(), 500);
    setTimeout(() => this._fetchState(), 1500);
    setTimeout(() => this._fetchState(), 3000);
  }

  // Returns the relevant Sonos entity for transport commands.
  // Prefers the active coordinator (playing), falls back to any paused Sonos speaker.
  private _sonosCoordinator(): string | null {
    const active = this._hass?.states[SONOS_COORDINATOR_SENSOR]?.state;
    if (active && active !== 'unknown' && active !== 'unavailable' && active !== '') {
      return active;
    }
    // Coordinator sensor is empty when paused — find first paused Sonos speaker.
    if (this._hass) {
      for (const entity of SONOS_ENTITIES) {
        const state = this._hass.states[entity]?.state;
        if (state === 'paused') return entity;
      }
    }
    return null;
  }

  private _onBrowseAlbum(e: CustomEvent) {
    this._pendingAlbumDrill = e.detail.album as SpotifyApi.Album;
    this._view = 'browse';
  }

  private _onMiniControl(e: CustomEvent) {
    this._handleTransportAction(e.detail.action);
  }

  private _onTransportAction(e: CustomEvent) {
    this._handleTransportAction(e.detail.action);
  }

  private _handleTransportAction(action: string) {
    if (!this._hass) return;

    // If Sonos is the active coordinator, route directly through HA media_player.
    // Spotify Web API returns 403 for all transport commands on Sonos devices.
    const coordinator = this._sonosCoordinator();
    if (coordinator) {
      const serviceMap: Record<string, string> = {
        'play-pause': this._playbackState?.is_playing ? 'media_pause' : 'media_play',
        'next': 'media_next_track',
        'prev': 'media_previous_track',
      };
      const service = serviceMap[action];
      if (service) {
        this._hass.callService('media_player', service, { entity_id: coordinator })
          .then(() => this._onPlaybackChanged())
          .catch(() => { /* ignore */ });
      }
      return;
    }

    // No Sonos active — use Spotify Web API directly.
    if (!this._api) return;
    if (action === 'play-pause') {
      const p = this._playbackState?.is_playing ? this._api.pause() : this._api.play();
      p.then(() => this._onPlaybackChanged()).catch(() => { /* ignore */ });
    } else if (action === 'next') {
      this._api.next().then(() => this._onPlaybackChanged()).catch(() => { /* ignore */ });
    } else if (action === 'prev') {
      this._api.previous().then(() => this._onPlaybackChanged()).catch(() => { /* ignore */ });
    }
  }

  render() {
    if (!this._config) return nothing;

    const height = this._config.height ?? 500;
    const pb = this._playbackState;
    const track = pb?.item;
    const imageUrl = track?.album?.images?.[0]?.url ?? null;
    const artistNames = track?.artists?.map(a => a.name).join(', ') ?? '';

    return html`
      <ha-card style="overflow: hidden;">
        <div class="card-content">
          ${this._error
            ? html`
                <div class="error-state">
                  <span class="error-icon">⚠️</span>
                  <span class="error-msg">${this._error}</span>
                </div>
              `
            : this._view === 'now-playing'
              ? html`
                  <div class="panel">
                    <spotify-now-playing
                      .api=${this._api}
                      .playbackState=${this._playbackState}
                      .progressMs=${this._progressMs}
                      .hass=${this._hass}
                      .sonosCoordinator=${this._sonosCoordinator()}
                      @playback-changed=${this._onPlaybackChanged}
                      @transport-action=${this._onTransportAction}
                      @show-browse=${() => this._view = 'browse'}
                      @browse-album=${this._onBrowseAlbum}
                    ></spotify-now-playing>
                  </div>
                `
              : html`
                  <div class="panel">
                    <spotify-browse-panel
                      .api=${this._api}
                      .initialAlbum=${this._pendingAlbumDrill}
                      .hass=${this._hass}
                      .sonosCoordinator=${this._sonosCoordinator()}
                      .artworkUrl=${imageUrl}
                      .isPlaying=${pb?.is_playing ?? false}
                      @playback-changed=${this._onPlaybackChanged}
                      @show-now-playing=${() => { this._view = 'now-playing'; this._pendingAlbumDrill = null; }}
                      @mini-control=${this._onMiniControl}
                    >
                      ${imageUrl
                        ? html`<img slot="mini-art" src=${imageUrl} alt="" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:4px" />`
                        : nothing}
                      <span slot="mini-title" style="display:flex;flex-direction:column">
                        <span style="font-size:12px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${track?.name ?? 'Not playing'}</span>
                        <span style="font-size:11px;color:rgba(255,255,255,0.45)">${artistNames}</span>
                      </span>
                    </spotify-browse-panel>
                  </div>
                `
          }
        </div>
      </ha-card>
    `;
  }
}

declare global {
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
  interface HTMLElementTagNameMap {
    'lovelace-spotify-browser': SpotifyBrowserCard;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'lovelace-spotify-browser',
  name: 'Spotify Browser',
  description: 'Browse and control Spotify from your Home Assistant dashboard',
});
