# Lovelace Spotify Browser

A custom Lovelace card for Home Assistant that lets you browse and control Spotify directly from your dashboard — playlists, recently played, top tracks, search, device picker, and full transport controls.

![Screenshot placeholder — add a screenshot here](docs/screenshot.png)

---

## Prerequisites

- Home Assistant 2024.1 or newer
- The official **Spotify integration** must be configured: [HA Spotify docs](https://www.home-assistant.io/integrations/spotify/)
- You need a `media_player.*` entity created by that integration (e.g. `media_player.spotify_yourname`)

---

## Installation via HACS

1. Open HACS in your Home Assistant sidebar
2. Go to **Frontend** → click the **+** button
3. Search for **Lovelace Spotify Browser** and install it
4. Go to **Settings → Dashboards → Resources** and confirm the resource is listed (HACS adds it automatically)
5. Reload your browser

---

## Manual Installation

1. Download `lovelace-spotify-browser.js` from the [latest release](../../releases/latest)
2. Copy it to `config/www/lovelace-spotify-browser.js` in your HA config directory
3. Add a resource in your dashboard:
   - **URL**: `/local/lovelace-spotify-browser.js`
   - **Resource type**: JavaScript module
4. Reload your browser

---

## Card Configuration

Add a card to your dashboard with type `custom:lovelace-spotify-browser`:

```yaml
type: custom:lovelace-spotify-browser
spotify_entity: media_player.spotify_yourname
default_device: media_player.kitchen      # optional
height: 600                                # optional
```

### Config reference

| Key              | Type    | Required | Default                     | Description                                                               |
|------------------|---------|----------|-----------------------------|---------------------------------------------------------------------------|
| `spotify_entity` | string  | yes      | —                           | The `media_player` entity ID created by the HA Spotify integration         |
| `default_device` | string  | no       | active device or first found | Device ID to use for playback when no other device is active               |
| `height`         | integer | no       | `500`                       | Card height in pixels                                                     |

---

## How the token works

This card does **not** use `sp_dc`/`sp_key` cookies or any undocumented Spotify API. The Home Assistant Spotify integration manages a standard OAuth 2.0 access token and stores it in the entity's attributes. This card reads that token on every API call, so it is always current — HA handles refresh automatically.

---

## Features

- **Now Playing** — album art, track info, scrubable progress bar, play/pause/skip, volume slider, device picker
- **Browse > Playlists** — your Spotify playlists; tap to start playback
- **Browse > Recently Played** — recent tracks; tap to play
- **Browse > Top Tracks** — your personal top tracks; tap to play
- **Browse > Search** — debounced search across tracks and playlists; tap to play
- Follows your HA theme (light and dark)
- Polls playback state every 5 seconds; stops polling when card is removed from DOM

---

## Contributing

Pull requests are welcome. Please:

1. Fork the repo and create a branch from `main`
2. Run `npm install` then `npm run build` to verify the build passes
3. Commit the updated `dist/lovelace-spotify-browser.js` with your changes
4. Open a PR with a clear description of what changed and why

For bug reports, include your HA version, the Spotify entity ID (without the actual username), and the browser console output.
