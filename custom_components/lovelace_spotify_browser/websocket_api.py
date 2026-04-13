"""WebSocket API for Lovelace Spotify Browser."""
import logging
from typing import Any

import aiohttp
import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

_LOGGER = logging.getLogger(__name__)

SPOTIFY_API_BASE = "https://api.spotify.com/v1"


def async_register_commands(hass: HomeAssistant) -> None:
    """Register websocket commands."""
    websocket_api.async_register_command(hass, handle_spotify_request)


def _get_spotify_token(hass: HomeAssistant) -> str | None:
    """Get the Spotify OAuth token from config entries."""
    entries = hass.config_entries.async_entries("spotify")
    if not entries:
        return None
    entry = entries[0]
    # HA stores the token in entry.data under the OAuth2 token structure
    token_data = entry.data.get("token")
    if not token_data:
        return None
    return token_data.get("access_token")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "lovelace_spotify_browser/request",
        vol.Required("method"): str,
        vol.Required("endpoint"): str,
        vol.Optional("body"): dict,
        vol.Optional("params"): dict,
    }
)
@websocket_api.async_response
async def handle_spotify_request(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Handle a proxied Spotify API request."""
    token = _get_spotify_token(hass)
    if not token:
        connection.send_error(
            msg["id"],
            "no_spotify_entry",
            "Spotify integration not configured or no token available",
        )
        return

    method = msg["method"].upper()
    endpoint = msg["endpoint"]
    body = msg.get("body")
    params = msg.get("params")

    url = f"{SPOTIFY_API_BASE}{endpoint}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.request(
                method,
                url,
                headers=headers,
                json=body if body else None,
                params=params,
            ) as resp:
                if resp.status == 204:
                    # No content (e.g. play/pause/skip responses)
                    connection.send_result(msg["id"], {})
                    return
                if resp.status == 401:
                    connection.send_error(
                        msg["id"],
                        "token_expired",
                        "Spotify token expired. Please re-authenticate in Home Assistant.",
                    )
                    return
                if resp.status >= 400:
                    error_body = await resp.text()
                    connection.send_error(
                        msg["id"],
                        f"spotify_error_{resp.status}",
                        error_body,
                    )
                    return
                data = await resp.json()
                connection.send_result(msg["id"], data)
    except aiohttp.ClientError as err:
        _LOGGER.error("Error calling Spotify API: %s", err)
        connection.send_error(msg["id"], "request_failed", str(err))
