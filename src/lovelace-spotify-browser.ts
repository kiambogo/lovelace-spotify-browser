import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  SpotifyBrowserCardConfig,
  SpotifyPlaybackState,
  SpotifyDevice,
  MainTab,
} from './types.js';
import * as api from './spotify-api.js';
import { TokenError } from './spotify-api.js';

// Import sub-components so they register themselves
import './components/now-playing.js';
import './components/browse-panel.js';
import './components/device-picker.js';

@customElement('lovelace-spotify-browser')
export class SpotifyBrowserCard extends LitElement {
  @state() private _config: SpotifyBrowserCardConfig | null = null;
  @state() private _hass: HomeAssistant | null = null;
  @state() private _playbackState: SpotifyPlaybackState | null = null;
  @state() private _devices: SpotifyDevice[] = [];
  @state() private _selectedDeviceId = '';
  @state() private _activeTab: MainTab = 'now-playing';
  @state() private _error = '';
  @state() private _loading = false;

  private _pollInterval: ReturnType<typeof setInterval> | null = null;

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    .card-content {
      display: flex;
      flex-direction: column;
      height: var(--spotify-card-height, 500px);
      overflow: hidden;
    }

    .main-tabs {
      display: flex;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .main-tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      cursor: pointer;
      padding: 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--secondary-text-color);
      transition: color 0.15s, border-color 0.15s;
    }

    .main-tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
    }

    .panel {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
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
      color: var(--error-color, #f44336);
    }

    .error-state .error-icon {
      font-size: 36px;
    }

    .error-state .error-msg {
      font-size: 14px;
      line-height: 1.5;
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--secondary-text-color);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  setConfig(config: SpotifyBrowserCardConfig) {
    if (!config.spotify_entity) {
      throw new Error('spotify_entity is required in card config');
    }
    this._config = config;
    // Apply configured height
    const height = config.height ?? 500;
    this.style.setProperty('--spotify-card-height', `${height}px`);

    // Pre-select default device if configured
    if (config.default_device) {
      this._selectedDeviceId = config.default_device;
    }
  }

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  static getConfigElement(): HTMLElement {
    // Minimal config editor — returns a plain element; full visual editor is out of scope
    const el = document.createElement('div');
    el.innerHTML = `<p style="padding:8px;font-size:13px;">Edit config YAML directly. Required: <code>spotify_entity</code></p>`;
    return el;
  }

  static getStubConfig(): SpotifyBrowserCardConfig {
    return { spotify_entity: 'media_player.spotify' };
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
    this._fetchPlaybackAndDevices();
    this._pollInterval = setInterval(() => this._fetchPlaybackAndDevices(), 5000);
  }

  private _stopPolling() {
    if (this._pollInterval !== null) {
      clearInterval(this._pollInterval);
      this._pollInterval = null;
    }
  }

  private async _fetchPlaybackAndDevices() {
    if (!this._hass || !this._config) return;

    try {
      this._error = '';
      const [playback, devicesResp] = await Promise.all([
        api.getPlaybackState(this._hass, this._config.spotify_entity),
        api.getDevices(this._hass, this._config.spotify_entity),
      ]);

      this._playbackState = playback;
      this._devices = devicesResp.devices;

      // Auto-select active device if none selected
      if (!this._selectedDeviceId) {
        const active = devicesResp.devices.find((d) => d.is_active);
        if (active) this._selectedDeviceId = active.id;
        else if (devicesResp.devices.length > 0) this._selectedDeviceId = devicesResp.devices[0].id;
      }
    } catch (err) {
      if (err instanceof TokenError) {
        this._error = err.message;
      } else if (err instanceof api.SpotifyApiError) {
        if (err.status === 401) {
          this._error = 'Spotify token expired. HA should refresh it shortly.';
        } else {
          this._error = `Spotify API error: ${err.message}`;
        }
      }
      // For transient network errors, keep last known state — don't show error
    }
  }

  private _onDeviceSelected(e: CustomEvent) {
    this._selectedDeviceId = e.detail.deviceId;
  }

  private _onPlaybackChanged() {
    // Trigger an immediate refresh after a user action
    setTimeout(() => this._fetchPlaybackAndDevices(), 500);
  }

  private _switchMainTab(tab: MainTab) {
    this._activeTab = tab;
  }

  render() {
    if (!this._config) return nothing;

    const height = this._config.height ?? 500;

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
            : html`
                <div class="main-tabs">
                  <button
                    class="main-tab-btn ${this._activeTab === 'now-playing' ? 'active' : ''}"
                    @click=${() => this._switchMainTab('now-playing')}
                  >
                    Now Playing
                  </button>
                  <button
                    class="main-tab-btn ${this._activeTab === 'browse' ? 'active' : ''}"
                    @click=${() => this._switchMainTab('browse')}
                  >
                    Browse
                  </button>
                </div>

                <div class="panel">
                  ${this._activeTab === 'now-playing'
                    ? html`
                        <spotify-now-playing
                          .hass=${this._hass}
                          .spotifyEntity=${this._config.spotify_entity}
                          .playbackState=${this._playbackState}
                          .devices=${this._devices}
                          .selectedDeviceId=${this._selectedDeviceId}
                          @device-selected=${this._onDeviceSelected}
                          @playback-changed=${this._onPlaybackChanged}
                        ></spotify-now-playing>
                      `
                    : html`
                        <spotify-browse-panel
                          .hass=${this._hass}
                          .spotifyEntity=${this._config.spotify_entity}
                          .selectedDeviceId=${this._selectedDeviceId}
                          @playback-changed=${this._onPlaybackChanged}
                        ></spotify-browse-panel>
                      `}
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
}

// Register card with Home Assistant's card registry
// (window as any).customCards is the HA convention for registering custom cards
// so they appear in the card picker UI
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
    }>;
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
