/**
 * X Sidebar Cleaner — Popup Logic
 * Controls the Enable/Disable toggle and persists settings to browser storage.
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'enabled';
  const toggleEl = document.getElementById('toggle-enabled');
  const statusTextEl = document.getElementById('status-text');

  function getStorageArea() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.sync || chrome.storage.local;
    }
    return null;
  }

  function updateUI(isEnabled) {
    if (!toggleEl || !statusTextEl) return;

    toggleEl.checked = isEnabled;
    toggleEl.setAttribute('aria-checked', isEnabled ? 'true' : 'false');

    if (isEnabled) {
      statusTextEl.textContent = 'Active';
      statusTextEl.className = 'status-badge status-active';
    } else {
      statusTextEl.textContent = 'Paused';
      statusTextEl.className = 'status-badge status-disabled';
    }
  }

  async function notifyTabs(enabled) {
    if (typeof chrome === 'undefined' || !chrome.tabs) return;

    try {
      // Direct notification to the currently active tab if open on X
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: 'SET_ENABLED',
          enabled: enabled
        }).catch(() => {
          // Tab might not be X/Twitter or still loading; storage.onChanged handles cross-tab sync
        });
      }
    } catch (err) {
      // Fallback: storage.onChanged reliably fires in all content script frames
    }
  }

  async function init() {
    const storage = getStorageArea();
    let isEnabled = true;

    if (storage) {
      try {
        const data = await storage.get({ [STORAGE_KEY]: true });
        isEnabled = data[STORAGE_KEY] !== false;
      } catch (err) {
        isEnabled = true;
      }
    }

    updateUI(isEnabled);

    if (toggleEl) {
      toggleEl.addEventListener('change', async (event) => {
        const checked = event.target.checked;
        updateUI(checked);

        if (storage) {
          try {
            await storage.set({ [STORAGE_KEY]: checked });
          } catch (err) {
            console.error('Failed to save setting:', err);
          }
        }

        notifyTabs(checked);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
