import { LitElement, html, css, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  SpotifyBrowserCardConfig,
  SpotifyDevice,
  MainTab,
} from './types.js';
import { SpotifyApi } from './spotify-api.js';

// Import sub-components so they register themselves
import './components/now-playing.js';
import './components/browse-panel.js';
import './components/device-picker.js';

@customElement('lovelace-spotify-browser')
export class SpotifyBrowserCard extends LitElement {
  @state() private _config: SpotifyBrowserCardConfig | null = null;
  @state() private _hass: HomeAssistant | null = null;
  @state() private _playbackState: SpotifyApi.PlaybackState | null = null;
  @state() private _devices: SpotifyDevice[] = [];
  @state() private _selectedDeviceId = '';
  @state() private _activeTab: MainTab = 'now-playing';
  @state() private _error = '';

  private _api: SpotifyApi | null = null;
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
    if (!this._api) {
      this._api = new SpotifyApi(hass);
    } else {
      this._api.hass = hass;
    }
  }

  static getConfigElement(): HTMLElement {
    const el = document.createElement('div');
    el.innerHTML = `<p style="padding:8px;font-size:13px;">Edit config YAML directly. No spotify_entity needed — the integration reads the token server-side.</p>`;
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
    if (!this._api) return;

    try {
      this._error = '';
      const [playback, devicesResp] = await Promise.all([
        this._api.getCurrentPlayback(),
        this._api.getDevices(),
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
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('token_expired') || msg.includes('401')) {
        this._error = 'Spotify token expired. Please re-authenticate in Home Assistant.';
      } else if (msg.includes('no_spotify_entry')) {
        this._error = 'Spotify integration not configured. Add the lovelace_spotify_browser integration to Home Assistant.';
      } else {
        // For transient errors keep last known state — don't show error
      }
    }
  }

  private _onDeviceSelected(e: CustomEvent) {
    this._selectedDeviceId = e.detail.deviceId;
  }

  private _onPlaybackChanged() {
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
                          .api=${this._api}
                          .playbackState=${this._playbackState}
                          .devices=${this._devices}
                          .selectedDeviceId=${this._selectedDeviceId}
                          @device-selected=${this._onDeviceSelected}
                          @playback-changed=${this._onPlaybackChanged}
                        ></spotify-now-playing>
                      `
                    : html`
                        <spotify-browse-panel
                          .api=${this._api}
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
