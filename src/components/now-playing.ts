import { LitElement, html, css, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { SpotifyApi } from '../spotify-api.js';
import type { HomeAssistant } from '../types.js';

@customElement('spotify-now-playing')
export class NowPlayingPanel extends LitElement {
  @property({ attribute: false }) api: SpotifyApi | null = null;
  @property({ attribute: false }) playbackState: SpotifyApi.PlaybackState | null = null;
  @property({ attribute: false }) hass: HomeAssistant | null = null;
  @property({ attribute: false }) sonosCoordinator: string | null = null;

  @state() private _seekDragging = false;
  @state() private _seekValue = 0;
  @state() private _shuffle = false;
  @state() private _repeat: 'off' | 'context' | 'track' = 'off';
  @state() private _localProgressMs = 0;

  private _suppressShuffleUntil = 0;
  private _suppressRepeatUntil = 0;
  private _progressInterval: ReturnType<typeof setInterval> | null = null;
  private _progressBaseMs = 0;
  private _progressBaseTime = 0;

  static styles = css`
    :host {
      display: block;
      position: relative;
      background: #0a0a0a;
      color: #fff;
      overflow: hidden;
    }

    /* Blurred artwork background */
    .artwork-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      filter: blur(60px) saturate(1.8) brightness(0.22);
      transform: scale(1.3);
      pointer-events: none;
      transition: background-image 0.6s ease;
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 20px 16px;
      gap: 0;
    }

    /* Header row */
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .header-label {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      font-weight: 500;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      padding: 5px;
      transition: color 0.18s, background 0.18s;
    }
    .icon-btn:hover {
      color: #fff;
      background: rgba(255,255,255,0.08);
    }

    /* Artwork */
    .artwork-wrap {
      width: 200px;
      height: 200px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06) inset;
      flex-shrink: 0;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .artwork-wrap:hover {
      transform: scale(1.015);
    }
    .artwork-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .artwork-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.06);
      font-size: 56px;
    }

    /* Track info */
    .track-info {
      margin-top: 18px;
      text-align: center;
      width: 100%;
    }
    .track-name {
      font-size: 17px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      letter-spacing: -0.01em;
    }
    .track-artist {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .track-album {
      font-size: 12px;
      color: rgba(255,255,255,0.3);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: pointer;
      transition: color 0.15s;
    }
    .track-album:hover {
      color: rgba(255,255,255,0.7);
    }

    .no-track {
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-style: italic;
      padding: 40px 0;
      font-size: 14px;
    }

    /* Progress */
    .progress-section {
      width: 100%;
      margin-top: 16px;
    }
    .progress-bar-wrap {
      position: relative;
      height: 3px;
      background: rgba(255,255,255,0.12);
      border-radius: 2px;
      cursor: pointer;
    }
    .progress-fill {
      height: 100%;
      background: #1DB954;
      border-radius: 2px;
      position: relative;
      pointer-events: none;
    }
    .progress-thumb {
      position: absolute;
      right: -5px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.15s ease;
    }
    .progress-bar-wrap:hover .progress-thumb {
      transform: translateY(-50%) scale(1);
    }
    .progress-times {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      font-size: 10px;
      color: rgba(255,255,255,0.3);
      font-variant-numeric: tabular-nums;
    }

    /* Controls */
    .controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      margin-top: 14px;
      width: 100%;
    }

    .ctrl-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.18s, transform 0.18s, background 0.18s;
      flex-shrink: 0;
      position: relative;
    }
    .ctrl-btn:hover { color: #fff; }
    .ctrl-btn:active { transform: scale(0.9); }

    .ctrl-btn.active {
      color: #1DB954;
    }
    .ctrl-btn.active::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 3px;
      background: #1DB954;
      border-radius: 50%;
    }

    .ctrl-sm { width: 36px; height: 36px; padding: 8px; }
    .ctrl-md { width: 42px; height: 42px; padding: 9px; }
    .ctrl-play {
      width: 52px;
      height: 52px;
      background: #1DB954;
      color: #000 !important;
      border-radius: 50%;
      padding: 14px;
      box-shadow: 0 4px 20px rgba(29,185,84,0.35);
    }
    .ctrl-play:hover {
      background: #1ed760 !important;
      transform: scale(1.05);
      box-shadow: 0 6px 28px rgba(29,185,84,0.5);
    }

  `;

  private _fmtMs(ms: number): string {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }

  private _onPlayPause() {
    this._emitTransport('play-pause');
  }

  private _onNext() {
    this._emitTransport('next');
  }

  private _onPrevious() {
    this._emitTransport('prev');
  }

  private _emitTransport(action: string) {
    this.dispatchEvent(new CustomEvent('transport-action', { detail: { action }, bubbles: true, composed: true }));
  }

  private async _onShuffle() {
    this._shuffle = !this._shuffle;
    this._suppressShuffleUntil = Date.now() + 3000;
    if (this.sonosCoordinator && this.hass) {
      this.hass.callService('media_player', 'shuffle_set', {
        entity_id: this.sonosCoordinator,
        shuffle: this._shuffle,
      }).then(() => this._emit()).catch(() => { /* ignore */ });
    } else if (this.api) {
      try { await this.api.setShuffle(this._shuffle); this._emit(); } catch (_e) { /* ignore */ }
    }
  }

  private async _onRepeat() {
    const states: Array<'off' | 'context' | 'track'> = ['off', 'context', 'track'];
    const idx = states.indexOf(this._repeat);
    this._repeat = states[(idx + 1) % 3];
    this._suppressRepeatUntil = Date.now() + 3000;
    if (this.sonosCoordinator && this.hass) {
      // HA repeat modes: 'off', 'all', 'one'
      const haRepeat = this._repeat === 'context' ? 'all' : this._repeat === 'track' ? 'one' : 'off';
      this.hass.callService('media_player', 'repeat_set', {
        entity_id: this.sonosCoordinator,
        repeat: haRepeat,
      }).then(() => this._emit()).catch(() => { /* ignore */ });
    } else if (this.api) {
      try { await this.api.setRepeat(this._repeat); this._emit(); } catch (_e) { /* ignore */ }
    }
  }

  private _onSeekClick(e: MouseEvent) {
    const pb = this.playbackState;
    if (!pb?.item) return;
    const bar = (e.currentTarget as HTMLElement);
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const posMs = Math.round(ratio * pb.item.duration_ms);
    if (this.sonosCoordinator && this.hass) {
      this.hass.callService('media_player', 'media_seek', {
        entity_id: this.sonosCoordinator,
        seek_position: posMs / 1000,
      }).then(() => this._emit()).catch(() => { /* ignore */ });
    } else if (this.api) {
      this.api.seek(posMs).then(() => this._emit()).catch(() => { /* ignore */ });
    }
  }

  private _onAlbumClick() {
    const album = this.playbackState?.item?.album;
    if (!album) return;
    this.dispatchEvent(new CustomEvent('browse-album', { detail: { album }, bubbles: true, composed: true }));
  }

  private _emit() {
    this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
  }

  connectedCallback() {
    super.connectedCallback();
    this._startProgressTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopProgressTimer();
  }

  private _startProgressTimer() {
    this._progressInterval = setInterval(() => {
      if (this.playbackState?.is_playing && !this._seekDragging) {
        const elapsed = Date.now() - this._progressBaseTime;
        const duration = this.playbackState.item?.duration_ms ?? 0;
        this._localProgressMs = Math.min(this._progressBaseMs + elapsed, duration);
      }
    }, 1000);
  }

  private _stopProgressTimer() {
    if (this._progressInterval !== null) {
      clearInterval(this._progressInterval);
      this._progressInterval = null;
    }
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('playbackState') && this.playbackState) {
      const now = Date.now();
      if (now > this._suppressShuffleUntil) this._shuffle = this.playbackState.shuffle_state ?? false;
      if (now > this._suppressRepeatUntil) this._repeat = this.playbackState.repeat_state ?? 'off';
      // Sync local progress baseline from the ground-truth poll
      this._progressBaseMs = this.playbackState.progress_ms ?? 0;
      this._progressBaseTime = Date.now();
      this._localProgressMs = this._progressBaseMs;
    }
  }

  render() {
    const pb = this.playbackState;
    const track = pb?.item ?? null;
    const isPlaying = pb?.is_playing ?? false;
    const progressMs = this._seekDragging ? this._seekValue : this._localProgressMs;
    const durationMs = track?.duration_ms ?? 0;
    const pct = durationMs > 0 ? Math.min(100, (progressMs / durationMs) * 100) : 0;
    const imageUrl = track?.album?.images?.[0]?.url ?? null;
    const artistNames = track?.artists?.map(a => a.name).join(', ') ?? '';

    return html`
      ${imageUrl ? html`<div class="artwork-bg" style="background-image: url(${imageUrl})"></div>` : nothing}

      <div class="content">
        <div class="header">
          <span class="header-label">Now Playing</span>
          <button class="icon-btn" @click=${() => this.dispatchEvent(new CustomEvent('show-browse', { bubbles: true, composed: true }))} title="Browse">
            ${svgList}
          </button>
        </div>

        <div class="artwork-wrap">
          ${imageUrl
            ? html`<img src=${imageUrl} alt="Album art" />`
            : html`<div class="artwork-placeholder">🎵</div>`}
        </div>

        ${track ? html`
          <div class="track-info">
            <div class="track-name">${track.name}</div>
            <div class="track-artist">${artistNames}</div>
            <div class="track-album" @click=${this._onAlbumClick} title="Browse album">${track.album.name}</div>
          </div>

          <div class="progress-section">
            <div class="progress-bar-wrap" @click=${this._onSeekClick}>
              <div class="progress-fill" style="width: ${pct.toFixed(2)}%">
                <div class="progress-thumb"></div>
              </div>
            </div>
            <div class="progress-times">
              <span>${this._fmtMs(progressMs)}</span>
              <span>${this._fmtMs(durationMs)}</span>
            </div>
          </div>
        ` : html`<div class="no-track">No active Spotify session</div>`}

        <div class="controls">
          <button
            class="ctrl-btn ctrl-sm ${this._shuffle ? 'active' : ''}"
            @click=${this._onShuffle}
            title="Shuffle"
          >${svgShuffle}</button>

          <button class="ctrl-btn ctrl-md" @click=${this._onPrevious} title="Previous">
            ${svgPrev}
          </button>

          <button class="ctrl-btn ctrl-play" @click=${this._onPlayPause} title=${isPlaying ? 'Pause' : 'Play'}>
            ${isPlaying ? svgPause : svgPlay}
          </button>

          <button class="ctrl-btn ctrl-md" @click=${this._onNext} title="Next">
            ${svgNext}
          </button>

          <button
            class="ctrl-btn ctrl-sm ${this._repeat !== 'off' ? 'active' : ''}"
            @click=${this._onRepeat}
            title=${this._repeat === 'off' ? 'Repeat off' : this._repeat === 'context' ? 'Repeat all' : 'Repeat one'}
          >${this._repeat === 'track' ? svgRepeatOne : svgRepeat}</button>
        </div>

      </div>
    `;
  }
}

// ── SVG icons ──────────────────────────────────────────────────────────────
const svgPlay = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M8 5v14l11-7z"/></svg>`;
const svgPause = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const svgPrev = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`;
const svgNext = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zM16 6h2v12h-2z"/></svg>`;
const svgShuffle = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>`;
const svgRepeat = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`;
const svgRepeatOne = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v6H13z"/></svg>`;
const svgList = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>`;

void nothing;

declare global {
  interface HTMLElementTagNameMap {
    'spotify-now-playing': NowPlayingPanel;
  }
}
