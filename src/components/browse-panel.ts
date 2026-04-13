import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  SpotifyPlaylist,
  SpotifyTrack,
  BrowseTab,
} from '../types.js';
import * as api from '../spotify-api.js';

@customElement('spotify-browse-panel')
export class BrowsePanel extends LitElement {
  @property({ attribute: false }) hass: HomeAssistant | null = null;
  @property({ type: String }) spotifyEntity = '';
  @property({ type: String }) selectedDeviceId = '';

  @state() private _activeTab: BrowseTab = 'playlists';
  @state() private _playlists: SpotifyPlaylist[] = [];
  @state() private _recentTracks: SpotifyTrack[] = [];
  @state() private _topTracks: SpotifyTrack[] = [];
  @state() private _searchResults: { tracks: SpotifyTrack[]; playlists: SpotifyPlaylist[] } = {
    tracks: [],
    playlists: [],
  };
  @state() private _searchQuery = '';
  @state() private _loading = false;
  @state() private _error = '';

  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
    }

    .tab-bar {
      display: flex;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      padding: 10px 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
    }

    .tab-btn.active {
      color: var(--primary-color, #03a9f4);
      border-bottom-color: var(--primary-color, #03a9f4);
      font-weight: 600;
    }

    .tab-content {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    .error {
      padding: 16px;
      color: var(--error-color, #f44336);
      font-size: 13px;
      text-align: center;
    }

    .empty {
      padding: 16px;
      color: var(--secondary-text-color);
      font-style: italic;
      text-align: center;
    }

    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.15s;
    }

    .item:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.05));
    }

    .item-thumb {
      width: 44px;
      height: 44px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: var(--divider-color, #e0e0e0);
    }

    .item-thumb-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 4px;
      background: var(--divider-color, #e0e0e0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .search-box {
      padding: 8px 16px;
      flex-shrink: 0;
    }

    .search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 20px;
      background: transparent;
      color: var(--primary-text-color);
      font-size: 14px;
      outline: none;
    }

    .search-input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .search-section-label {
      padding: 8px 16px 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color);
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._loadTab(this._activeTab);
  }

  private async _loadTab(tab: BrowseTab) {
    if (!this.hass || !this.spotifyEntity || tab === 'search') return;

    this._loading = true;
    this._error = '';

    try {
      if (tab === 'playlists') {
        const resp = await api.getPlaylists(this.hass, this.spotifyEntity);
        this._playlists = resp.items;
      } else if (tab === 'recently-played') {
        const resp = await api.getRecentlyPlayed(this.hass, this.spotifyEntity);
        this._recentTracks = resp.items.map((i) => i.track);
      } else if (tab === 'top-tracks') {
        const resp = await api.getTopTracks(this.hass, this.spotifyEntity);
        this._topTracks = resp.items;
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Failed to load data';
    } finally {
      this._loading = false;
    }
  }

  private _switchTab(tab: BrowseTab) {
    if (this._activeTab === tab) return;
    this._activeTab = tab;
    this._loadTab(tab);
  }

  private _onSearchInput(e: Event) {
    const query = (e.target as HTMLInputElement).value;
    this._searchQuery = query;

    if (this._searchDebounceTimer) clearTimeout(this._searchDebounceTimer);

    if (!query.trim()) {
      this._searchResults = { tracks: [], playlists: [] };
      return;
    }

    this._searchDebounceTimer = setTimeout(() => this._doSearch(query), 300);
  }

  private async _doSearch(query: string) {
    if (!this.hass || !this.spotifyEntity) return;
    this._loading = true;
    this._error = '';
    try {
      const resp = await api.search(this.hass, this.spotifyEntity, query);
      this._searchResults = {
        tracks: resp.tracks?.items ?? [],
        playlists: resp.playlists?.items ?? [],
      };
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Search failed';
    } finally {
      this._loading = false;
    }
  }

  private async _playPlaylist(playlist: SpotifyPlaylist) {
    if (!this.hass) return;
    try {
      await api.play(this.hass, this.spotifyEntity, {
        context_uri: playlist.uri,
        device_id: this.selectedDeviceId || undefined,
      });
      this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
    } catch (_e) { /* ignore */ }
  }

  private async _playTrack(track: SpotifyTrack) {
    if (!this.hass) return;
    try {
      await api.play(this.hass, this.spotifyEntity, {
        uris: [track.uri],
        device_id: this.selectedDeviceId || undefined,
      });
      this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
    } catch (_e) { /* ignore */ }
  }

  private _renderThumb(images: { url: string }[] | undefined, fallback: string) {
    const url = images?.[0]?.url;
    return url
      ? html`<img class="item-thumb" src=${url} alt="" />`
      : html`<div class="item-thumb-placeholder">${fallback}</div>`;
  }

  private _renderPlaylists() {
    if (this._loading) return this._renderLoading();
    if (this._error) return html`<div class="error">${this._error}</div>`;
    if (!this._playlists.length) return html`<div class="empty">No playlists found</div>`;

    return this._playlists.map(
      (p) => html`
        <div class="item" @click=${() => this._playPlaylist(p)}>
          ${this._renderThumb(p.images, '🎵')}
          <div class="item-info">
            <div class="item-name">${p.name}</div>
            <div class="item-sub">${p.tracks.total} tracks · ${p.owner.display_name}</div>
          </div>
        </div>
      `
    );
  }

  private _renderRecentlyPlayed() {
    if (this._loading) return this._renderLoading();
    if (this._error) return html`<div class="error">${this._error}</div>`;
    if (!this._recentTracks.length) return html`<div class="empty">No recent tracks</div>`;

    return this._recentTracks.map(
      (t) => html`
        <div class="item" @click=${() => this._playTrack(t)}>
          ${this._renderThumb(t.album.images, '🎵')}
          <div class="item-info">
            <div class="item-name">${t.name}</div>
            <div class="item-sub">${t.artists.map((a) => a.name).join(', ')}</div>
          </div>
        </div>
      `
    );
  }

  private _renderTopTracks() {
    if (this._loading) return this._renderLoading();
    if (this._error) return html`<div class="error">${this._error}</div>`;
    if (!this._topTracks.length) return html`<div class="empty">No top tracks found</div>`;

    return this._topTracks.map(
      (t) => html`
        <div class="item" @click=${() => this._playTrack(t)}>
          ${this._renderThumb(t.album.images, '🎵')}
          <div class="item-info">
            <div class="item-name">${t.name}</div>
            <div class="item-sub">${t.artists.map((a) => a.name).join(', ')}</div>
          </div>
        </div>
      `
    );
  }

  private _renderSearch() {
    const hasResults =
      this._searchResults.tracks.length > 0 || this._searchResults.playlists.length > 0;

    return html`
      <div class="search-box">
        <input
          class="search-input"
          type="search"
          placeholder="Search tracks, artists, playlists…"
          .value=${this._searchQuery}
          @input=${this._onSearchInput}
        />
      </div>
      ${this._loading ? this._renderLoading() : nothing}
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      ${!this._loading && this._searchQuery && !hasResults
        ? html`<div class="empty">No results for "${this._searchQuery}"</div>`
        : nothing}
      ${this._searchResults.tracks.length
        ? html`
            <div class="search-section-label">Tracks</div>
            ${this._searchResults.tracks.map(
              (t) => html`
                <div class="item" @click=${() => this._playTrack(t)}>
                  ${this._renderThumb(t.album.images, '🎵')}
                  <div class="item-info">
                    <div class="item-name">${t.name}</div>
                    <div class="item-sub">${t.artists.map((a) => a.name).join(', ')}</div>
                  </div>
                </div>
              `
            )}
          `
        : nothing}
      ${this._searchResults.playlists.length
        ? html`
            <div class="search-section-label">Playlists</div>
            ${this._searchResults.playlists.map(
              (p) => html`
                <div class="item" @click=${() => this._playPlaylist(p)}>
                  ${this._renderThumb(p.images, '🎵')}
                  <div class="item-info">
                    <div class="item-name">${p.name}</div>
                    <div class="item-sub">${p.tracks.total} tracks</div>
                  </div>
                </div>
              `
            )}
          `
        : nothing}
    `;
  }

  private _renderLoading() {
    return html`
      <div class="loading">
        <div class="spinner"></div>
        Loading…
      </div>
    `;
  }

  render() {
    const tabs: Array<{ id: BrowseTab; label: string }> = [
      { id: 'playlists', label: 'Playlists' },
      { id: 'recently-played', label: 'Recent' },
      { id: 'top-tracks', label: 'Top Tracks' },
      { id: 'search', label: 'Search' },
    ];

    return html`
      <div class="tab-bar">
        ${tabs.map(
          (t) => html`
            <button
              class="tab-btn ${this._activeTab === t.id ? 'active' : ''}"
              @click=${() => this._switchTab(t.id)}
            >
              ${t.label}
            </button>
          `
        )}
      </div>

      <div class="tab-content">
        ${this._activeTab === 'playlists' ? this._renderPlaylists() : nothing}
        ${this._activeTab === 'recently-played' ? this._renderRecentlyPlayed() : nothing}
        ${this._activeTab === 'top-tracks' ? this._renderTopTracks() : nothing}
        ${this._activeTab === 'search' ? this._renderSearch() : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'spotify-browse-panel': BrowsePanel;
  }
}
