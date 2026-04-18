# Agent Brief — lovelace-spotify-browser

## What you're building

A custom Lovelace card for Home Assistant that provides a full Spotify browser and player — playlists, albums, artists, search, device picker, and transport controls — embedded directly in a dashboard.

**Repo name**: `lovelace-spotify-browser`
**Distribution**: HACS (Home Assistant Community Store)

---

## Why this exists

The existing options are all broken in some way:
- Native `media-control` card: transport controls only, no library browsing
- `spotify-card` / `spotify-card-v2` + `spotcast`: uses undocumented Spotify internal cookies (`sp_dc`/`sp_key`) that expire unpredictably — fragile and unsupported
- Spotify iframe: blocked by `X-Frame-Options: DENY`

This card uses the **official Spotify Web API** via the OAuth token that Home Assistant's native Spotify integration already manages. No cookies, no private APIs, no credential maintenance.

---

## Hard requirements

### HACS compatibility
- Must include a valid `hacs.json` at the repo root
- Must be installable as a **Dashboard** (Lovelace) resource via HACS
- Compiled output must be a single JS file: `lovelace-spotify-browser.js`
- Must register as a custom element: `customElements.define('lovelace-spotify-browser', ...)`
- Card type in dashboards: `custom:lovelace-spotify-browser`

### Home Assistant compatibility
- Must work with HA 2024.1+
- Must implement the Lovelace custom card interface:
  - `setConfig(config)` — receive card config
  - `set hass(hass)` — receive HA state object
  - `static getConfigElement()` — optional but good to have for visual editor support
  - `static getStubConfig()` — return a minimal default config
- Card config schema:
  ```yaml
  type: custom:lovelace-spotify-browser
  spotify_entity: media_player.spotify_<username>   # required — the HA Spotify media_player entity
  default_device: media_player.kitchen              # optional — default cast target
  height: 600                                       # optional — card height in px, default 500
  ```

### Spotify API usage
- **Do not use `sp_dc` / `sp_key` cookies or any undocumented Spotify endpoints.** These expire and violate Spotify's ToS.
- The HA Spotify integration exposes the OAuth access token via the entity's state attributes or via a HA service call. Retrieve it from HA state, not from cookies.
- Use the official [Spotify Web API](https://developer.spotify.com/documentation/web-api) for all data:
  - `GET /me/playlists` — user's playlists
  - `GET /browse/featured-playlists` — featured/recommended
  - `GET /me/top/tracks` and `/me/top/artists` — personalized
  - `GET /search` — search
  - `PUT /me/player/play` — start playback on a device
  - `POST /me/player/next`, `POST /me/player/previous` — skip
  - `PUT /me/player/pause` — pause
  - `GET /me/player/devices` — available devices
  - `PUT /me/player/volume` — volume
- Token refresh: rely on HA to keep the token fresh — re-read it from the `hass` object on each API call rather than caching it long-term.

---

## Tech stack

- **TypeScript** — strict mode
- **Lit 3.x** (`lit` package) — the standard for HA custom cards; reactive properties, shadow DOM
- **Vite** — build tool; outputs a single bundled `lovelace-spotify-browser.js`
- **No UI framework** (no React, no Vue) — Lit only, keeps bundle small

### Package structure
```
lovelace-spotify-browser/
├── src/
│   ├── lovelace-spotify-browser.ts   # main card element
│   ├── spotify-api.ts                # Spotify Web API client
│   ├── types.ts                      # TypeScript interfaces
│   └── components/                   # sub-components (player, browser, search)
├── dist/
│   └── lovelace-spotify-browser.js  # compiled output (committed to repo for HACS)
├── hacs.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## UI / UX spec

The card has two panels, switchable via tabs:

### Panel 1 — Now Playing
- Album art (large)
- Track name, artist, album
- Progress bar (scrubable)
- Transport controls: previous / play-pause / next
- Volume slider
- Device picker dropdown (lists devices from `/me/player/devices`)
- Heart/save button for current track

### Panel 2 — Browse
- Tab bar: **Playlists | Recently Played | Top Tracks | Search**
- Each tab shows a scrollable list of items with thumbnail, name, subtitle
- Tapping an item starts playback on the currently selected device
- Search tab: text input → debounced search → results across tracks, albums, artists, playlists

### General
- Respects HA theme variables (`--primary-color`, `--card-background-color`, `--primary-text-color`, etc.) — must look correct in both light and dark themes
- Responsive: works at both narrow (mobile) and wide (desktop) card widths
- Loading states and error states (e.g. "No active Spotify session", "No devices available") must be handled gracefully — no blank cards

---

## HACS metadata

`hacs.json`:
```json
{
  "name": "Lovelace Spotify Browser",
  "render_readme": true,
  "filename": "lovelace-spotify-browser.js"
}
```

---

## README requirements

The README must include:
1. Screenshot or GIF of the card in action
2. Prerequisites (HA Spotify integration must be configured first — link to HA docs)
3. Installation via HACS (step by step)
4. Manual installation fallback
5. Card configuration reference (all config keys, types, defaults)
6. How the token works (brief — reassures users no cookies are used)
7. Contributing guide

---

## Non-goals (do not build)
- Multi-account support
- Podcast support
- Lyrics display
- Any use of `sp_dc` / `sp_key` cookies or the internal Spotify API
- A HA integration / custom component — this is a frontend card only

---

## Definition of done
- [ ] Card renders in HA with a valid `spotify_entity` config key
- [ ] Browse panel shows user's playlists and top tracks
- [ ] Tapping a playlist starts playback on the configured/selected device
- [ ] Now Playing panel shows current track with working transport controls
- [ ] Device picker works — changing device transfers playback
- [ ] Card respects HA light and dark themes
- [ ] Installable via HACS (hacs.json present, JS file in repo root or dist/)
- [ ] README covers installation and configuration
- [ ] No cookie-based auth anywhere in the codebase
