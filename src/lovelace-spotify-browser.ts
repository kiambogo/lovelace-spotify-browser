import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  SpotifyBrowserCardConfig,
} from './types.js';
import { SpotifyApi } from './spotify-api.js';

import './components/now-playing.js';
import './components/browse-panel.js';

// Sonos/HA media_player entity IDs — transport commands go here when Spotify
// Web API returns 403 (Restricted device) because the active device is Sonos.
const SONOS_COORDINATOR_SENSOR = 'sensor.sonos_active_coordinator';

@customElement('lovelace-spotify-browser')
export class SpotifyBrowserCard extends LitElement {
  @state() private _config: SpotifyBrowserCardConfig | null = null;
  @state() private _playbackState: SpotifyApi.PlaybackState | null = null;
  @state() private _view: 'now-playing' | 'browse' = 'now-playing';
  @state() private _error = '';
  @state() private _pendingAlbumDrill: SpotifyApi.Album | null = null;

  private _hass: HomeAssistant | null = null;
  private _api: SpotifyApi | null = null;
  private _pollInterval: ReturnType<typeof setInterval> | null = null;

  static styles = css`
    :host { display: block; }

    ha-card {
      overflow: hidden;
      background: #0a0a0a;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      height: var(--spotify-card-height, 500px);
      overflow: hidden;
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
  }

  private _stopPolling() {
    if (this._pollInterval !== null) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  }

  private async _fetchState() {
    if (!this._api) return;
    try {
      this._error = '';
      this._playbackState = await this._api.getCurrentPlayback();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('token_expired') || msg.includes('401')) {
        this._error = 'Spotify token expired. Re-authenticate in Home Assistant.';
      } else if (msg.includes('no_spotify_entry')) {
        this._error = 'Spotify integration not configured.';
      }
    }
  }

  private _onPlaybackChanged() {
    setTimeout(() => this._fetchState(), 500);
  }

  // Returns the active Sonos coordinator entity ID, or null if none active.
  private _sonosCoordinator(): string | null {
    const state = this._hass?.states[SONOS_COORDINATOR_SENSOR]?.state;
    return state && state !== 'unknown' && state !== 'unavailable' && state !== '' ? state : null;
  }

  // Try Spotify Web API first; if it 403s with "Restricted device", fall back
  // to HA media_player service on the active Sonos coordinator.
  private async _transport(
    spotifyFn: () => Promise<unknown>,
    haService: string
  ) {
    try {
      await spotifyFn();
      this._onPlaybackChanged();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('403') || msg.includes('Restricted')) {
        const coordinator = this._sonosCoordinator();
        if (coordinator && this._hass) {
          await this._hass.callService('media_player', haService, { entity_id: coordinator });
          this._onPlaybackChanged();
        }
      }
    }
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
    if (!this._api) return;
    if (action === 'play-pause') {
      const isPlaying = this._playbackState?.is_playing;
      this._transport(
        () => isPlaying ? this._api!.pause() : this._api!.play(),
        isPlaying ? 'media_pause' : 'media_play'
      );
    } else if (action === 'next') {
      this._transport(() => this._api!.next(), 'media_next_track');
    } else if (action === 'prev') {
      this._transport(() => this._api!.previous(), 'media_previous_track');
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
      <ha-card style="height: ${height}px; overflow: hidden;">
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
