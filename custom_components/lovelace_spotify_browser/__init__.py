"""Lovelace Spotify Browser integration."""
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType
from . import websocket_api

DOMAIN = "lovelace_spotify_browser"

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the integration and register websocket commands."""
    websocket_api.async_register_commands(hass)
    return True
