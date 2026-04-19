# Lovelace Spotify Browser

Browse and control Spotify directly from your Home Assistant dashboard — playlists, recently played, top tracks, search, and full transport controls.

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
4. Also copy the `custom_components/lovelace_spotify_browser/` directory to your HA `config/custom_components/` folder
5. Restart Home Assistant
6. Reload your browser

---

## Prerequisites

- Home Assistant 2024.1+
- The [Spotify integration](https://www.home-assistant.io/integrations/spotify/) installed and authenticated — go to **Settings → Integrations → Add Integration → Spotify**

---

## Configuration

```yaml
type: custom:lovelace-spotify-browser
height: 600                                     # optional, default 500
```

### With Sonos speakers

If you have Sonos speakers, add these options so the card can route playback commands correctly:

```yaml
type: custom:lovelace-spotify-browser
sonos_coordinator_sensor: sensor.sonos_active_coordinator   # optional
sonos_entities:                                              # optional
  - media_player.living_room
  - media_player.kitchen
  - media_player.bedroom
height: 600
```

| Key | Required | Default | Description |
|-----|----------|---------|-------------|
| `height` | no | `500` | Card height in pixels |
| `sonos_coordinator_sensor` | no | — | Sensor entity that reports the active Sonos coordinator (e.g. from the Sonos integration). When present, playback is routed through HA instead of the Spotify Web API. |
| `sonos_entities` | no | `[]` | List of Sonos `media_player` entities. Used as a fallback to find a paused speaker when the coordinator sensor reports nothing. |

> **Without Sonos config:** The card uses the Spotify Web API directly for all transport commands.
>
> **With Sonos config:** Transport commands (play, pause, next, previous, seek, shuffle, repeat) are routed through Home Assistant's `media_player` services, which is required for Sonos devices that reject direct Spotify API commands.

---

## Features

- **Now Playing** — album art with blurred background, track/artist/album info, scrubbable progress bar, play/pause/skip/shuffle/repeat
- **Playlists** — browse all your playlists with infinite scroll; tap to drill in, play, or shuffle
- **Liked Songs** — appears as the first playlist entry
- **Recently Played** — last 50 tracks
- **Top Tracks** — your all-time top 50
- **Search** — search tracks and playlists; tap to play or drill in
- Polls playback state every 5 seconds; stops polling when the card is disconnected

---

## Troubleshooting

### "Spotify integration not configured"

The Spotify integration must be installed and authenticated first. Go to **Settings → Integrations → Add Integration → Spotify** and log in.

### "Spotify token expired"

Go to **Settings → Integrations → Spotify** and re-authenticate.

### Card is blank or shows no content

Check the browser console (F12) for errors. Common causes:
- Custom component not installed (`custom_components/lovelace_spotify_browser/` missing)
- Home Assistant not restarted after installing the custom component
- Spotify integration not authenticated

### "No active Spotify session"

Appears when Spotify isn't currently playing on any device. Start playback from the Spotify app or web player and the card will pick it up within 5 seconds.

### Sonos playback not working

Make sure `sonos_coordinator_sensor` and `sonos_entities` are set in the card config (see above). Without these, the card routes commands through the Spotify Web API, which rejects transport commands on Sonos devices.

---

## Contributing

PRs welcome. Fork → branch from `main` → `npm install && npm run build` → commit the updated `dist/` file → open a PR.

Bug reports: include your HA version, browser console output, and whether you're using Sonos.
