/**
 * X Sidebar Cleaner — Content Script
 *
 * Lightweight, accessible, cross-browser DOM cleaner that hides the "What's happening"
 * trending and promoted content card in X's right sidebar while strictly preserving
 * "Who to follow" / "You might like", search, and the primary timeline.
 */

(() => {
  'use strict';

  // Prevent multiple injections
  if (window.__xSidebarCleanerInjected) return;
  window.__xSidebarCleanerInjected = true;

  const STORAGE_KEY = 'enabled';
  const ATTR_ENABLED = 'data-x-sidebar-cleaner-enabled';
  const ATTR_HIDDEN = 'data-x-sidebar-cleaner-hidden';

  let isEnabled = true;
  let scheduledFrame = null;
  let observer = null;

  /**
   * Safe storage access (supports both chrome.storage.sync and chrome.storage.local)
   */
  function getStorageArea() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return chrome.storage.sync || chrome.storage.local;
    }
    return null;
  }

  /**
   * Update root attribute and visual state
   */
  function setEnabled(enabled) {
    isEnabled = Boolean(enabled);
    if (document.documentElement) {
      document.documentElement.setAttribute(ATTR_ENABLED, isEnabled ? 'true' : 'false');
    }

    if (isEnabled) {
      clean();
    } else {
      restore();
    }
  }

  /**
   * Determine if an element safely represents the "What's happening" / Trends card.
   * Protects against hiding parent containers or the "Who to follow" / "You might like" card.
   */
  function isValidTrendingCard(card, sidebar) {
    if (!card || card === sidebar || card === document.body || card === document.documentElement) {
      return false;
    }

    // Must be inside the sidebar
    if (!sidebar.contains(card)) {
      return false;
    }

    // NEVER hide primary column or search box
    if (card.querySelector('[data-testid="primaryColumn"]') || card.querySelector('[data-testid="SearchBox_Search_Input"]')) {
      return false;
    }

    // NEVER hide "Who to follow" / "You might like" section
    const hasWhoToFollowLabel = card.matches('[aria-label*="Who to follow" i]') ||
      Boolean(card.querySelector('[aria-label*="Who to follow" i]'));
    const hasUserCell = Boolean(card.querySelector('[data-testid="UserCell"]'));
    if (hasWhoToFollowLabel || hasUserCell) {
      return false;
    }

    // Check if card contains "Who to follow" or "You might like" heading text
    const textContent = card.textContent || '';
    if (/(who to follow|you might like)/i.test(textContent) && !/(what[’']s happening|trending now)/i.test(textContent)) {
      return false;
    }

    // Verify it contains trending content or matching heading
    const hasTrendTestId = Boolean(card.querySelector('[data-testid="trend"]'));
    const hasTrendingLabel = card.matches('[aria-label*="Trending" i]') ||
      Boolean(card.querySelector('[aria-label*="Trending" i]'));
    const hasWhatsHappeningText = /(what[’']s happening)/i.test(textContent);

    return hasTrendTestId || hasTrendingLabel || hasWhatsHappeningText;
  }

  /**
   * Finds the smallest distinct card-level container inside the sidebar
   * that wraps the trending section.
   */
  function resolveCardContainer(candidate, sidebar) {
    if (!candidate || !sidebar) return null;

    // If candidate itself is a <section> or <aside> or has aria-label, check it first
    if ((candidate.tagName === 'SECTION' || candidate.tagName === 'ASIDE' || candidate.hasAttribute('aria-label')) &&
        isValidTrendingCard(candidate, sidebar)) {
      // Check if candidate has an immediate parent that only wraps this section with styling
      const parent = candidate.parentElement;
      if (parent && parent !== sidebar && parent.children.length === 1 && isValidTrendingCard(parent, sidebar)) {
        return parent;
      }
      return candidate;
    }

    // Traverse upwards from child element (e.g. heading or trend item)
    let current = candidate;
    let cardCandidate = null;

    while (current && current !== sidebar && current.parentElement) {
      if (current.tagName === 'SECTION' ||
          current.tagName === 'ASIDE' ||
          current.getAttribute('aria-label')?.includes('Trending') ||
          (current.parentElement && current.parentElement.children.length > 1 && current.classList.length > 0)) {
        if (isValidTrendingCard(current, sidebar)) {
          cardCandidate = current;
          // If we reached a <section> or element with aria-label, this is usually the ideal boundary
          if (current.tagName === 'SECTION' || current.tagName === 'ASIDE' || current.getAttribute('aria-label')?.includes('Trending')) {
            break;
          }
        }
      }
      current = current.parentElement;
    }

    return cardCandidate || (isValidTrendingCard(candidate, sidebar) ? candidate : null);
  }

  /**
   * Inspect the sidebar and hide the target "What's happening" card
   */
  function clean() {
    if (!isEnabled) return;

    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (!sidebar) return;

    const candidates = [];

    // 1. Semantic ARIA query (Timeline: Trending now)
    const ariaTrending = sidebar.querySelectorAll(
      '[aria-label="Timeline: Trending now"], [aria-label*="Trending now" i], [aria-label*="Timeline: Trending" i]'
    );
    ariaTrending.forEach((el) => candidates.push(el));

    // 2. Heading-based detection ("What’s happening" or "What's happening")
    const headings = sidebar.querySelectorAll('h2, span[role="heading"]');
    headings.forEach((h) => {
      const text = (h.textContent || '').trim();
      if (/^what[’']s happening$/i.test(text)) {
        candidates.push(h);
      }
    });

    // 3. Trend item detection
    const trendItems = sidebar.querySelectorAll('[data-testid="trend"]');
    if (trendItems.length > 0) {
      candidates.push(trendItems[0]);
    }

    // Resolve and hide unique cards
    const targetsToHide = new Set();
    for (const cand of candidates) {
      const card = resolveCardContainer(cand, sidebar);
      if (card && isValidTrendingCard(card, sidebar)) {
        targetsToHide.add(card);
      }
    }

    targetsToHide.forEach((card) => {
      if (card.getAttribute(ATTR_HIDDEN) !== 'true') {
        card.setAttribute(ATTR_HIDDEN, 'true');
      }
    });
  }

  /**
   * Restore all hidden elements when extension is disabled
   */
  function restore() {
    const hidden = document.querySelectorAll(`[${ATTR_HIDDEN}="true"]`);
    hidden.forEach((el) => {
      el.removeAttribute(ATTR_HIDDEN);
    });
  }

  /**
   * Debounced cleanup scheduler using requestAnimationFrame
   */
  function scheduleClean() {
    if (!isEnabled) return;
    if (scheduledFrame) return;

    scheduledFrame = requestAnimationFrame(() => {
      scheduledFrame = null;
      clean();
    });
  }

  /**
   * Initialize DOM MutationObserver to handle dynamic React rendering and navigation
   */
  function initObserver() {
    if (observer) return;

    observer = new MutationObserver((mutations) => {
      if (!isEnabled) return;

      // Quick filter: only process if nodes were added
      let hasAddedNodes = false;
      for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes && mutations[i].addedNodes.length > 0) {
          hasAddedNodes = true;
          break;
        }
      }

      if (hasAddedNodes) {
        scheduleClean();
      }
    });

    const targetNode = document.body || document.documentElement;
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * Listen for SPA navigation events
   */
  function initNavigationListeners() {
    window.addEventListener('popstate', scheduleClean);

    // Patch pushState / replaceState for seamless in-page SPA routing
    ['pushState', 'replaceState'].forEach((method) => {
      const original = history[method];
      if (typeof original === 'function') {
        history[method] = function (...args) {
          const result = original.apply(this, args);
          scheduleClean();
          return result;
        };
      }
    });
  }

  /**
   * Initialize extension runtime listeners and storage sync
   */
  async function init() {
    // 1. Initial enabled state
    const storage = getStorageArea();
    if (storage) {
      try {
        const data = await storage.get({ [STORAGE_KEY]: true });
        isEnabled = data[STORAGE_KEY] !== false;
      } catch (err) {
        isEnabled = true;
      }
    }

    setEnabled(isEnabled);

    // 2. Storage change listener (syncs across tabs and when popup changes settings)
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes[STORAGE_KEY] !== undefined) {
          setEnabled(Boolean(changes[STORAGE_KEY].newValue));
        }
      });
    }

    // 3. Runtime message listener for instant toggle from popup
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message && message.type === 'SET_ENABLED') {
          setEnabled(Boolean(message.enabled));
          sendResponse({ success: true, enabled: isEnabled });
        } else if (message && message.type === 'GET_STATUS') {
          sendResponse({ success: true, enabled: isEnabled });
        }
        return false;
      });
    }

    // 4. Initial clean pass
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        scheduleClean();
        initObserver();
      }, { once: true });
    } else {
      scheduleClean();
      initObserver();
    }

    initNavigationListeners();
  }

  // Kickoff
  init();
})();
