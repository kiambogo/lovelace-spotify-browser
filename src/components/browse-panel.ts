import { LitElement, html, css, nothing, svg } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { BrowseTab, HomeAssistant } from '../types.js';
import { SpotifyApi } from '../spotify-api.js';

type DrillTarget =
  | { kind: 'album'; album: SpotifyApi.Album }
  | { kind: 'playlist'; playlist: SpotifyApi.Playlist };

@customElement('spotify-browse-panel')
export class BrowsePanel extends LitElement {
  @property({ attribute: false }) api: SpotifyApi | null = null;
  @property({ attribute: false }) initialAlbum: SpotifyApi.Album | null = null;
  @property({ attribute: false }) hass: HomeAssistant | null = null;
  @property({ attribute: false }) sonosCoordinator: string | null = null;

  @state() private _activeTab: BrowseTab = 'playlists';
  @state() private _playlists: SpotifyApi.Playlist[] = [];
  @state() private _recentTracks: SpotifyApi.Track[] = [];
  @state() private _topTracks: SpotifyApi.Track[] = [];
  @state() private _searchResults: { tracks: SpotifyApi.Track[]; playlists: SpotifyApi.Playlist[] } = { tracks: [], playlists: [] };
  @state() private _searchQuery = '';
  @state() private _loading = false;
  @state() private _searchLoading = false;
  @state() private _error = '';
  @state() private _drill: DrillTarget | null = null;
  @state() private _drillAlbumTracks: SpotifyApi.AlbumTrack[] = [];
  @state() private _drillPlaylistTracks: SpotifyApi.Track[] = [];
  @state() private _drillLoading = false;

  private _searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      background: #0a0a0a;
      color: #fff;
    }

    /* ── Tab bar ── */
    .tab-bar {
      display: flex;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      flex-shrink: 0;
      padding: 0 4px;
    }
    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      padding: 10px 4px;
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.35);
      white-space: nowrap;
      transition: color 0.15s, border-color 0.15s;
      position: relative;
    }
    .tab-btn.active {
      color: #fff;
      border-bottom-color: #1DB954;
    }
    .tab-btn:hover:not(.active) { color: rgba(255,255,255,0.65); }

    /* ── Drill header ── */
    .drill-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px 10px;
      flex-shrink: 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .back-btn {
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
      flex-shrink: 0;
      transition: color 0.15s, background 0.15s;
    }
    .back-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .drill-thumb {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255,255,255,0.06);
    }
    .drill-info { flex: 1; min-width: 0; }
    .drill-title {
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .drill-sub {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
      margin-top: 2px;
    }

    .drill-actions {
      display: flex;
      gap: 8px;
      padding: 10px 14px;
      flex-shrink: 0;
    }
    .drill-action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: opacity 0.15s, transform 0.15s;
    }
    .drill-action-btn:hover { opacity: 0.85; transform: scale(1.02); }
    .btn-play { background: #1DB954; color: #000; }
    .btn-shuffle { background: rgba(255,255,255,0.1); color: #fff; }
    .btn-icon { width: 14px; height: 14px; }

    /* ── Scroll list ── */
    .tab-content {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0 8px;
      min-height: 0;
    }
    .tab-content::-webkit-scrollbar { width: 3px; }
    .tab-content::-webkit-scrollbar-track { background: transparent; }
    .tab-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    /* ── List items ── */
    .item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 14px;
      cursor: pointer;
      border-radius: 4px;
      margin: 0 4px;
      transition: background 0.14s;
    }
    .item:hover { background: rgba(255,255,255,0.07); }
    .item.active { background: rgba(29,185,84,0.08); }
    .item.active .item-name { color: #1DB954; }

    .item-thumb {
      width: 42px;
      height: 42px;
      border-radius: 4px;
      object-fit: cover;
      flex-shrink: 0;
      background: rgba(255,255,255,0.06);
    }
    .item-thumb.round { border-radius: 50%; }
    .item-thumb-placeholder {
      width: 42px;
      height: 42px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .item-info { flex: 1; min-width: 0; }
    .item-name {
      font-size: 13px;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-sub {
      font-size: 11px;
      color: rgba(255,255,255,0.45);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    .item-play {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #1DB954;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      padding: 7px;
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.15s, transform 0.15s;
      flex-shrink: 0;
    }
    .item:hover .item-play { opacity: 1; transform: scale(1); }

    /* ── Search bar ── */
    .search-box {
      padding: 10px 14px;
      flex-shrink: 0;
    }
    .search-inner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 0 12px;
      transition: border-color 0.15s;
    }
    .search-inner:focus-within { border-color: rgba(29,185,84,0.5); }
    .search-icon { color: rgba(255,255,255,0.3); width: 14px; height: 14px; flex-shrink: 0; }
    .search-input {
      background: none;
      border: none;
      outline: none;
      font-size: 13px;
      color: #fff;
      padding: 10px 0;
      width: 100%;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.3); }

    .search-section-label {
      padding: 8px 14px 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255,255,255,0.3);
    }

    /* ── States ── */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      color: rgba(255,255,255,0.4);
      gap: 10px;
      font-size: 13px;
    }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.15);
      border-top-color: #1DB954;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .error { padding: 16px 14px; color: #f44336; font-size: 13px; text-align: center; }
    .empty { padding: 24px 14px; color: rgba(255,255,255,0.3); font-style: italic; text-align: center; font-size: 13px; }

    /* ── Mini now-playing bar ── */
    .mini-bar {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0,0,0,0.35);
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .mini-bar:hover { background: rgba(255,255,255,0.03); }
    .mini-art {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .mini-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .mini-meta { flex: 1; min-width: 0; }
    .mini-title { font-size: 12px; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .mini-artist { font-size: 11px; color: rgba(255,255,255,0.45); }
    .mini-controls { display: flex; gap: 2px; }
    .mini-btn {
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
      padding: 7px;
      transition: color 0.15s, background 0.15s;
    }
    .mini-btn:hover { color: #fff; background: rgba(255,255,255,0.07); }
    .mini-btn.play {
      background: #1DB954;
      color: #000;
      width: 28px;
      height: 28px;
    }
    .mini-btn.play:hover { background: #1ed760; }

    /* Equalizer animation */
    @keyframes eq1 { 0%,100%{height:4px} 50%{height:12px} }
    @keyframes eq2 { 0%,100%{height:10px} 50%{height:3px} }
    @keyframes eq3 { 0%,100%{height:7px} 50%{height:14px} }
    .eq { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
    .eq span { width: 3px; background: #1DB954; border-radius: 1px; display: block; }
    .eq span:nth-child(1) { animation: eq1 0.8s ease-in-out infinite; }
    .eq span:nth-child(2) { animation: eq2 0.8s ease-in-out infinite 0.15s; }
    .eq span:nth-child(3) { animation: eq3 0.8s ease-in-out infinite 0.3s; }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._loadTab(this._activeTab);
  }

  updated(changedProps: Map<string, unknown>) {
    if (changedProps.has('api') && this.api && !changedProps.get('api')) {
      this._loadTab(this._activeTab);
    }
    if (changedProps.has('initialAlbum') && this.initialAlbum) {
      this._openAlbumDrill(this.initialAlbum);
    }
  }

  drillAlbum(album: SpotifyApi.Album) {
    this._openAlbumDrill(album);
  }

  private async _openAlbumDrill(album: SpotifyApi.Album) {
    this._drill = { kind: 'album', album };
    this._drillAlbumTracks = [];
    this._drillPlaylistTracks = [];
    this._drillLoading = true;
    try {
      if (!this.api) return;
      const resp = await this.api.getAlbumTracks(album.id);
      this._drillAlbumTracks = resp.items ?? [];
    } catch (_e) { /* ignore */ } finally {
      this._drillLoading = false;
    }
  }

  private async _openPlaylistDrill(playlist: SpotifyApi.Playlist) {
    this._drill = { kind: 'playlist', playlist };
    this._drillAlbumTracks = [];
    this._drillPlaylistTracks = [];
    this._drillLoading = true;
    try {
      if (!this.api) return;
      const resp = await this.api.getPlaylistTracks(playlist.id);
      this._drillPlaylistTracks = (resp.items ?? [])
        .map(i => i.track)
        .filter((t): t is SpotifyApi.Track => t != null && !!t.uri);
    } catch (_e) { /* ignore */ } finally {
      this._drillLoading = false;
    }
  }

  private async _loadTab(tab: BrowseTab) {
    if (!this.api || tab === 'search') return;
    this._loading = true;
    this._error = '';
    try {
      if (tab === 'playlists') {
        const resp = await this.api.getPlaylists();
        this._playlists = (resp.items ?? []).filter((p): p is SpotifyApi.Playlist => p != null && p.uri != null);
      } else if (tab === 'recently-played') {
        const resp = await this.api.getRecentlyPlayed();
        this._recentTracks = (resp.items ?? []).map((i: any) => i.track).filter((t: any) => t && t.uri);
      } else if (tab === 'top-tracks') {
        const resp = await this.api.getTopTracks();
        this._topTracks = (resp.items ?? []).filter((t: any) => t && t.uri);
      }
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Failed to load';
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
    if (!this.api) return;
    this._searchLoading = true;
    this._error = '';
    try {
      const resp = await this.api.search(query);
      this._searchResults = {
        tracks: resp.tracks?.items ?? [],
        playlists: resp.playlists?.items ?? [],
      };
    } catch (err) {
      this._error = err instanceof Error ? err.message : 'Search failed';
    } finally {
      this._searchLoading = false;
    }
  }

  private async _playViaHa(mediaContentId: string, mediaContentType: string, shuffle = false) {
    if (!this.hass || !this.sonosCoordinator) return false;
    try {
      if (shuffle) {
        await this.hass.callService('media_player', 'shuffle_set', {
          entity_id: this.sonosCoordinator,
          shuffle: true,
        });
      }
      await this.hass.callService('media_player', 'play_media', {
        entity_id: this.sonosCoordinator,
        media_content_id: mediaContentId,
        media_content_type: mediaContentType,
      });
      return true;
    } catch (_e) { return false; }
  }

  private async _playPlaylist(playlist: SpotifyApi.Playlist, shuffle = false) {
    if (this.sonosCoordinator) {
      const ok = await this._playViaHa(playlist.uri, 'playlist', shuffle);
      if (ok) { this._emit(); return; }
    }
    if (!this.api) return;
    try {
      if (shuffle) await this.api.setShuffle(true);
      await this.api.play(playlist.uri);
      this._emit();
    } catch (_e) { /* ignore */ }
  }

  private async _playTrack(track: SpotifyApi.Track) {
    if (this.sonosCoordinator) {
      const ok = await this._playViaHa(track.uri, 'music', false);
      if (ok) { this._emit(); return; }
    }
    if (!this.api) return;
    try {
      await this.api.play(undefined, [track.uri]);
      this._emit();
    } catch (_e) { /* ignore */ }
  }

  private async _playAlbum(album: SpotifyApi.Album, shuffle = false, _trackUri?: string) {
    if (this.sonosCoordinator) {
      const ok = await this._playViaHa(album.uri, 'album', shuffle);
      if (ok) { this._emit(); return; }
    }
    if (!this.api) return;
    try {
      if (shuffle) await this.api.setShuffle(true);
      await this.api.play(album.uri, undefined, _trackUri);
      this._emit();
    } catch (_e) { /* ignore */ }
  }

  private async _playAlbumTrack(trackUri: string) {
    if (this.sonosCoordinator) {
      const ok = await this._playViaHa(trackUri, 'music', false);
      if (ok) { this._emit(); return; }
    }
    const drill = this._drill;
    if (!this.api || !drill || drill.kind !== 'album') return;
    try {
      await this.api.setShuffle(false);
      await this.api.play(drill.album.uri, undefined, trackUri);
      this._emit();
    } catch (_e) { /* ignore */ }
  }

  private async _playPlaylistTrack(track: SpotifyApi.Track) {
    const drill = this._drill;
    if (!drill || drill.kind !== 'playlist') return;
    if (this.sonosCoordinator) {
      const ok = await this._playViaHa(track.uri, 'music', false);
      if (ok) { this._emit(); return; }
    }
    if (!this.api) return;
    try {
      await this.api.play(drill.playlist.uri, undefined, track.uri);
      this._emit();
    } catch (_e) { /* ignore */ }
  }

  private _emit() {
    this.dispatchEvent(new CustomEvent('playback-changed', { bubbles: true, composed: true }));
  }

  // ── Rendering helpers ───────────────────────────────────────────────────

  private _thumb(images: { url: string }[] | null | undefined, round = false) {
    const url = images?.[0]?.url;
    return url
      ? html`<img class="item-thumb ${round ? 'round' : ''}" src=${url} alt="" />`
      : html`<div class="item-thumb-placeholder">🎵</div>`;
  }

  private _renderLoading() {
    return html`<div class="loading"><div class="spinner"></div>Loading…</div>`;
  }

  // ── Drill-down view ─────────────────────────────────────────────────────

  private _renderDrill() {
    const drill = this._drill!;
    const isAlbum = drill.kind === 'album';
    const item = isAlbum ? drill.album : drill.playlist;
    const images = isAlbum ? drill.album.images : (drill.playlist.images ?? []);
    const thumbUrl = images?.[0]?.url;
    const subLabel = isAlbum
      ? drill.album.artists?.map(a => a.name).join(', ')
      : drill.playlist.owner?.display_name ?? '';

    const tracks = isAlbum ? this._drillAlbumTracks : this._drillPlaylistTracks;

    return html`
      <div class="drill-header">
        <button class="back-btn" @click=${() => { this._drill = null; this._drillAlbumTracks = []; this._drillPlaylistTracks = []; }}>${svgBack}</button>
        ${thumbUrl ? html`<img class="drill-thumb" src=${thumbUrl} alt="" />` : nothing}
        <div class="drill-info">
          <div class="drill-title">${(item as any).name}</div>
          <div class="drill-sub">${subLabel}</div>
        </div>
      </div>

      <div class="drill-actions">
        <button
          class="drill-action-btn btn-play"
          @click=${() => isAlbum ? this._playAlbum(drill.album) : this._playPlaylist(drill.playlist)}
        >
          <span class="btn-icon">${svgPlaySmall}</span>
          Play
        </button>
        <button
          class="drill-action-btn btn-shuffle"
          @click=${() => isAlbum ? this._playAlbum(drill.album, true) : this._playPlaylist(drill.playlist, true)}
        >
          <span class="btn-icon">${svgShuffleSmall}</span>
          Shuffle
        </button>
      </div>

      <div class="tab-content">
        ${this._drillLoading ? this._renderLoading() : nothing}
        ${!this._drillLoading && tracks.length === 0
          ? html`<div class="empty">No tracks</div>`
          : nothing}
        ${isAlbum
          ? this._drillAlbumTracks.map((t, i) => html`
            <div class="item" @click=${() => this._playAlbumTrack(t.uri)}>
              <div class="item-thumb-placeholder" style="font-size:12px;color:rgba(255,255,255,0.35);width:42px;height:42px;">
                ${t.track_number ?? i + 1}
              </div>
              <div class="item-info">
                <div class="item-name">${t.name}</div>
                <div class="item-sub">${(t.artists ?? []).map(a => a.name).join(', ')}</div>
              </div>
              <button class="item-play" @click=${(e: Event) => { e.stopPropagation(); this._playAlbumTrack(t.uri); }}>
                ${svgPlaySmall}
              </button>
            </div>
          `)
          : this._drillPlaylistTracks.map((t) => html`
            <div class="item" @click=${() => this._playPlaylistTrack(t)}>
              ${this._thumb(t.album?.images)}
              <div class="item-info">
                <div class="item-name">${t.name}</div>
                <div class="item-sub">${(t.artists ?? []).map(a => a.name).join(', ')}</div>
              </div>
              <button class="item-play" @click=${(e: Event) => { e.stopPropagation(); this._playPlaylistTrack(t); }}>
                ${svgPlaySmall}
              </button>
            </div>
          `)
        }
      </div>
    `;
  }

  // ── Tab content renders ─────────────────────────────────────────────────

  private _renderPlaylists() {
    if (this._loading) return this._renderLoading();
    if (this._error) return html`<div class="error">${this._error}</div>`;
    if (!this._playlists.length) return html`<div class="empty">No playlists found</div>`;

    return this._playlists.map(p => html`
      <div class="item" @click=${() => this._openPlaylistDrill(p)}>
        ${this._thumb(p.images, true)}
        <div class="item-info">
          <div class="item-name">${p.name}</div>
          <div class="item-sub">${p.owner?.display_name ?? ''}</div>
        </div>
        <button class="item-play" @click=${(e: Event) => { e.stopPropagation(); this._playPlaylist(p); }}>
          ${svgPlaySmall}
        </button>
      </div>
    `);
  }

  private _renderTrackList(tracks: SpotifyApi.Track[], nowPlayingUri?: string) {
    return tracks.map(t => html`
      <div class="item ${t.uri === nowPlayingUri ? 'active' : ''}" @click=${() => this._playTrack(t)}>
        ${this._thumb(t.album?.images)}
        <div class="item-info">
          <div class="item-name">${t.name}</div>
          <div class="item-sub">
            ${t.uri === nowPlayingUri
              ? html`<span style="display:flex;align-items:center;gap:5px">
                  <span class="eq"><span></span><span></span><span></span></span>
                  Playing
                </span>`
              : (t.artists ?? []).map(a => a.name).join(', ')
            }
          </div>
        </div>
        <button class="item-play" @click=${(e: Event) => { e.stopPropagation(); this._playTrack(t); }}>
          ${svgPlaySmall}
        </button>
      </div>
    `);
  }

  private _renderSearch() {
    const hasResults = this._searchResults.tracks.length > 0 || this._searchResults.playlists.length > 0;
    return html`
      <div class="search-box">
        <div class="search-inner">
          <span class="search-icon">${svgSearch}</span>
          <input
            class="search-input"
            type="search"
            placeholder="Search tracks, artists, playlists…"
            .value=${this._searchQuery}
            @input=${this._onSearchInput}
          />
        </div>
      </div>
      ${this._searchLoading ? this._renderLoading() : nothing}
      ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
      ${!this._searchLoading && this._searchQuery && !hasResults
        ? html`<div class="empty">No results for "${this._searchQuery}"</div>`
        : nothing}
      ${this._searchResults.tracks.length ? html`
        <div class="search-section-label">Tracks</div>
        ${this._renderTrackList(this._searchResults.tracks)}
      ` : nothing}
      ${this._searchResults.playlists.length ? html`
        <div class="search-section-label">Playlists</div>
        ${this._searchResults.playlists.map(p => html`
          <div class="item" @click=${() => this._openPlaylistDrill(p)}>
            ${this._thumb(p.images, true)}
            <div class="item-info">
              <div class="item-name">${p.name}</div>
              <div class="item-sub">${p.owner?.display_name ?? ''}</div>
            </div>
            <button class="item-play" @click=${(e: Event) => { e.stopPropagation(); this._playPlaylist(p); }}>
              ${svgPlaySmall}
            </button>
          </div>
        `)}
      ` : nothing}
    `;
  }

  // ── Main render ─────────────────────────────────────────────────────────

  render() {
    // Drill-down overrides tab content but keeps mini-bar
    if (this._drill) {
      return html`
        ${this._renderDrill()}
        ${this._renderMiniBar()}
      `;
    }

    const tabs: Array<{ id: BrowseTab; label: string }> = [
      { id: 'playlists', label: 'Playlists' },
      { id: 'recently-played', label: 'Recent' },
      { id: 'top-tracks', label: 'Top' },
      { id: 'search', label: 'Search' },
    ];

    return html`
      <div class="tab-bar">
        ${tabs.map(t => html`
          <button
            class="tab-btn ${this._activeTab === t.id ? 'active' : ''}"
            @click=${() => this._switchTab(t.id)}
          >${t.label}</button>
        `)}
      </div>

      ${this._activeTab === 'search'
        ? html`${this._renderSearch()}`
        : html`
          <div class="tab-content">
            ${this._activeTab === 'playlists' ? this._renderPlaylists() : nothing}
            ${this._activeTab === 'recently-played'
              ? (this._loading ? this._renderLoading()
                : this._error ? html`<div class="error">${this._error}</div>`
                : !this._recentTracks.length ? html`<div class="empty">No recent tracks</div>`
                : this._renderTrackList(this._recentTracks))
              : nothing}
            ${this._activeTab === 'top-tracks'
              ? (this._loading ? this._renderLoading()
                : this._error ? html`<div class="error">${this._error}</div>`
                : !this._topTracks.length ? html`<div class="empty">No top tracks</div>`
                : this._renderTrackList(this._topTracks))
              : nothing}
          </div>
        `}

      ${this._renderMiniBar()}
    `;
  }

  private _renderMiniBar() {
    // Mini bar is rendered by the parent — emit event to go back to now-playing
    return html`
      <div class="mini-bar" @click=${() => this.dispatchEvent(new CustomEvent('show-now-playing', { bubbles: true, composed: true }))}>
        <div class="mini-art">
          <slot name="mini-art"></slot>
        </div>
        <div class="mini-meta">
          <slot name="mini-title"></slot>
        </div>
        <div class="mini-controls">
          <button class="mini-btn" @click=${(e: Event) => { e.stopPropagation(); this._emitControl('prev'); }}>${svgPrev}</button>
          <button class="mini-btn play" @click=${(e: Event) => { e.stopPropagation(); this._emitControl('play-pause'); }}>${svgPlaySmall}</button>
          <button class="mini-btn" @click=${(e: Event) => { e.stopPropagation(); this._emitControl('next'); }}>${svgNext}</button>
        </div>
      </div>
    `;
  }

  private _emitControl(action: string) {
    this.dispatchEvent(new CustomEvent('mini-control', { detail: { action }, bubbles: true, composed: true }));
  }
}

// ── SVG icons ──────────────────────────────────────────────────────────────
const svgPlaySmall = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M8 5v14l11-7z"/></svg>`;
const svgPauseSmall = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const svgPrev = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/></svg>`;
const svgNext = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8zM16 6h2v12h-2z"/></svg>`;
const svgBack = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>`;
const svgSearch = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
const svgShuffleSmall = svg`<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>`;

void nothing;
void svgPauseSmall; // referenced in mini-bar conditionally

declare global {
  interface HTMLElementTagNameMap {
    'spotify-browse-panel': BrowsePanel;
  }
}
