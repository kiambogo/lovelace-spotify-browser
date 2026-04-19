# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-04-19

### Added
- Lovelace custom card for browsing and controlling Spotify from Home Assistant
- Browse playlists (with infinite scroll), recently played, top tracks, and search
- Full transport controls: play/pause, next, previous, shuffle, repeat, seek, volume
- Album and playlist drill-down with infinite scroll pagination
- Liked Songs as a first-class playlist entry
- Sonos speaker support via configurable `sonos_coordinator_sensor` and `sonos_entities` card options
- Blurred album art background on the mini now-playing bar
- Home Assistant custom component backend (`custom_components/lovelace_spotify_browser`) that proxies Spotify API requests through HA's OAuth token — no extra credentials required

### Fixed
- Progress bar no longer resets every 5 seconds (was re-anchoring from stale HA `media_position` on every poll)
- Playing a track from Recent or Top Tracks now continues playback through the album instead of stopping after one song
- Playing a track from a playlist now starts the full playlist queue at that track
- Shuffle on Liked Songs no longer errors with "could not find Sonos playlist: spotify:collection"
- Search no longer gets stuck in a loading state on rapid input
