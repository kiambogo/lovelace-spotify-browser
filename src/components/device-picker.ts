import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SpotifyDevice } from '../types.js';

@customElement('spotify-device-picker')
export class DevicePicker extends LitElement {
  @property({ attribute: false }) devices: SpotifyDevice[] = [];
  @property({ type: String }) selectedDeviceId = '';

  static styles = css`
    :host {
      display: block;
    }

    .device-picker {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .device-icon {
      font-size: 16px;
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }

    select {
      flex: 1;
      background: transparent;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      color: var(--primary-text-color);
      font-size: 13px;
      padding: 4px 8px;
      cursor: pointer;
      min-width: 0;
      outline: none;
    }

    select:focus {
      border-color: var(--primary-color);
    }

    option {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }

    .no-devices {
      font-size: 13px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
  `;

  private _onChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.dispatchEvent(
      new CustomEvent('device-selected', {
        detail: { deviceId: select.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.devices || this.devices.length === 0) {
      return html`<div class="no-devices">No devices available</div>`;
    }

    return html`
      <div class="device-picker">
        <span class="device-icon">🔊</span>
        <select @change=${this._onChange} .value=${this.selectedDeviceId}>
          ${this.devices.map(
            (device) => html`
              <option
                value=${device.id}
                ?selected=${device.id === this.selectedDeviceId}
              >
                ${device.name}${device.is_active ? ' ✓' : ''}
              </option>
            `
          )}
        </select>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'spotify-device-picker': DevicePicker;
  }
}

// Suppress unused warning — nothing is a Lit export used in templates elsewhere
void nothing;
