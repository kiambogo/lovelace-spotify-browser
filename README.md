# Lovelace Spotify Browser

Browse and control Spotify directly from your Home Assistant dashboard — playlists, recently played, top tracks, search, device picker, and full transport controls.

> Uses the official Spotify Web API via the OAuth token your HA Spotify integration already manages. No cookies, no undocumented APIs.

---

## Installation

### HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=kiambogo&repository=lovelace-spotify-browser&category=frontend)

Or manually in HACS:

1. Go to **HACS → Frontend → ⋮ → Custom repositories**
2. Add `https://github.com/kiambogo/lovelace-spotify-browser` as category **Dashboard**
3. Search for **Lovelace Spotify Browser** and install it
4. Reload your browser

### Manual

1. Download `lovelace-spotify-browser.js` from the [latest release](../../releases/latest)
2. Copy it to `config/www/lovelace-spotify-browser.js`
3. Add a resource: **Settings → Dashboards → Resources → Add resource**
   - URL: `/local/lovelace-spotify-browser.js`
   - Type: JavaScript module
4. Reload your browser

---

## Prerequisites

- Home Assistant 2024.1+
- The [Spotify integration](https://www.home-assistant.io/integrations/spotify/) configured — this creates the `media_player.spotify_*` entity the card reads from

---

## Configuration

```yaml
type: custom:lovelace-spotify-browser
spotify_entity: media_player.spotify_yourname   # required
default_device: media_player.kitchen            # optional
height: 600                                     # optional, default 500
```

| Key | Required | Default | Description |
|-----|----------|---------|-------------|
| `spotify_entity` | yes | — | The `media_player` entity created by the HA Spotify integration |
| `default_device` | no | active or first device | Playback target when no device is already active |
| `height` | no | `500` | Card height in pixels |

---

## Features

- **Now Playing** — album art, track/artist/album, scrubable progress bar, play/pause/skip, volume slider, device picker
- **Browse** — Playlists, Recently Played, Top Tracks, Search; tap any item to start playback
- Follows your HA theme (light and dark)
- Polls playback state every 5 seconds; stops when the card is off-screen

---

## Contributing

PRs welcome. Fork → branch from `main` → `npm install && npm run build` → commit the updated `dist/` file → open a PR.

Bug reports: include your HA version, the Spotify entity ID (redact your username), and the browser console output.
