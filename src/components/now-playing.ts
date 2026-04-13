import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { SpotifyPlaybackState, SpotifyDevice, HomeAssistant } from '../types.js';
import * as api from '../spotify-api.js';

@customElement('spotify-now-playing')
export class NowPlayingPanel extends LitElement {
  @property({ attribute: false }) hass: HomeAssistant | null = null;
  @property({ type: String }) spotifyEntity = '';
  @property({ attribute: false }) playbackState: SpotifyPlaybackState | null = null;
  @property({ attribute: false }) devices: SpotifyDevice[] = [];
  @property({ type: String }) selectedDeviceId = '';

  @state() private _heartActive = false;
  @state() private _seekDragging = false;
  @state() private _seekValue = 0;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .album-art {
      width: 100%;
      max-width: 280px;
      aspect-ratio: 1;
      margin: 0 auto;
      border-radius: 8px;
      overflow: hidden;
      background: var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .album-art img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .album-art-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 64px;
    }

    .track-info {
      text-align: center;
    }

    .track-name {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-artist {
      font-size: 14px;
      color: var(--secondary-text-color);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .track-album {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 0;
      opacity: 0.7;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .no-track {
      text-align: center;
      color: var(--secondary-text-color);
      font-style: italic;
      padding: 32px 0;
    }

    .progress-section {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-bar {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, #e0e0e0);
      outline: none;
      cursor: pointer;
    }

    .progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .progress-bar::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .progress-bar::-webkit-slider-runnable-track {
      background: linear-gradient(
        to right,
        var(--primary-color, #03a9f4) var(--progress-pct, 0%),
        var(--divider-color, #e0e0e0) var(--progress-pct, 0%)
      );
      border-radius: 2px;
      height: 4px;
    }

    .progress-times {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: var(--secondary-text-color);
    }

    .transport {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }

    .transport button {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 20px;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }

    .transport button:hover {
      background: var(--divider-color, #e0e0e0);
    }

    .transport button.play-pause {
      font-size: 28px;
      background: var(--primary-color, #03a9f4);
      color: white;
      padding: 12px;
    }

    .transport button.play-pause:hover {
      opacity: 0.85;
      background: var(--primary-color, #03a9f4);
    }

    .heart-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 20px;
      padding: 8px;
      color: var(--secondary-text-color);
      transition: color 0.15s;
    }

    .heart-btn.active {
      color: #e91e63;
    }

    .volume-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .volume-icon {
      font-size: 16px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    .volume-slider {
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      height: 4px;
      border-radius: 2px;
      background: var(--divider-color, #e0e0e0);
      outline: none;
      cursor: pointer;
    }

    .volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    .volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: none;
      border-radius: 50%;
      background: var(--primary-color, #03a9f4);
      cursor: pointer;
    }
  `;

  private _formatMs(ms: number): string {
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  private async _onPlayPause() {
    if (!this.hass) return;
    try {
      if (this.playbackState?.is_playing) {
        await api.pause(this.hass, this.spotifyEntity);
      } else {
        await api.play(this.hass, this.spotifyEntity, {
          device_id: this.selectedDeviceId || undefined,
        });
      }
      this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
    } catch (_e) {
      // silently ignore — parent polls and will update state
    }
  }

  private async _onNext() {
    if (!this.hass) return;
    try {
      await api.next(this.hass, this.spotifyEntity);
      this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
    } catch (_e) { /* ignore */ }
  }

  private async _onPrevious() {
    if (!this.hass) return;
    try {
      await api.previous(this.hass, this.spotifyEntity);
      this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
    } catch (_e) { /* ignore */ }
  }

  private _onSeekInput(e: Event) {
    this._seekDragging = true;
    this._seekValue = Number((e.target as HTMLInputElement).value);
  }

  private async _onSeekChange(e: Event) {
    this._seekDragging = false;
    if (!this.hass || !this.playbackState?.item) return;
    const positionMs = Number((e.target as HTMLInputElement).value);
    try {
      await api.seek(this.hass, this.spotifyEntity, positionMs);
      this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
    } catch (_e) { /* ignore */ }
  }

  private async _onVolumeChange(e: Event) {
    if (!this.hass) return;
    const vol = Number((e.target as HTMLInputElement).value);
    try {
      await api.setVolume(this.hass, this.spotifyEntity, vol);
    } catch (_e) { /* ignore */ }
  }

  private _onDeviceSelected(e: CustomEvent) {
    this.dispatchEvent(
      new CustomEvent('device-selected', {
        detail: e.detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _toggleHeart() {
    this._heartActive = !this._heartActive;
  }

  render() {
    const pb = this.playbackState;
    const track = pb?.item ?? null;
    const isPlaying = pb?.is_playing ?? false;
    const progressMs = (!this._seekDragging && pb?.progress_ms != null)
      ? pb.progress_ms
      : this._seekDragging ? this._seekValue : 0;
    const durationMs = track?.duration_ms ?? 0;
    const progressPct = durationMs > 0 ? (progressMs / durationMs) * 100 : 0;
    const volume = pb?.device?.volume_percent ?? 50;

    const imageUrl = track?.album?.images?.[0]?.url ?? null;

    return html`
      <div class="album-art">
        ${imageUrl
          ? html`<img src=${imageUrl} alt="Album art" />`
          : html`<div class="album-art-placeholder">🎵</div>`}
      </div>

      ${track
        ? html`
            <div class="track-info">
              <p class="track-name">${track.name}</p>
              <p class="track-artist">${track.artists.map((a) => a.name).join(', ')}</p>
              <p class="track-album">${track.album.name}</p>
            </div>

            <div class="progress-section">
              <input
                type="range"
                class="progress-bar"
                min="0"
                max=${durationMs}
                .value=${String(progressMs)}
                style="--progress-pct: ${progressPct.toFixed(1)}%"
                @input=${this._onSeekInput}
                @change=${this._onSeekChange}
              />
              <div class="progress-times">
                <span>${this._formatMs(progressMs)}</span>
                <span>${this._formatMs(durationMs)}</span>
              </div>
            </div>
          `
        : html`<div class="no-track">No active Spotify session</div>`}

      <div class="transport">
        <button @click=${this._onPrevious} title="Previous">⏮</button>
        <button class="play-pause" @click=${this._onPlayPause} title=${isPlaying ? 'Pause' : 'Play'}>
          ${isPlaying ? '⏸' : '▶'}
        </button>
        <button @click=${this._onNext} title="Next">⏭</button>
        <button
          class="heart-btn ${this._heartActive ? 'active' : ''}"
          @click=${this._toggleHeart}
          title="Save track"
        >♥</button>
      </div>

      <div class="volume-section">
        <span class="volume-icon">🔈</span>
        <input
          type="range"
          class="volume-slider"
          min="0"
          max="100"
          .value=${String(volume)}
          @change=${this._onVolumeChange}
        />
        <span class="volume-icon">🔊</span>
      </div>

      <spotify-device-picker
        .devices=${this.devices}
        .selectedDeviceId=${this.selectedDeviceId}
        @device-selected=${this._onDeviceSelected}
      ></spotify-device-picker>
    `;
  }
}

// keep nothing import used
void nothing;

declare global {
  interface HTMLElementTagNameMap {
    'spotify-now-playing': NowPlayingPanel;
  }
}
