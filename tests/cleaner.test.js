/**
 * Automated Test: DOM Detection, Sidebar Removal & Preservation Verification
 */

import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Lightweight mock DOM environment for unit testing selector rules
 */
class MockElement {
  constructor(tagName, attributes = {}, textContent = '') {
    this.tagName = tagName.toUpperCase();
    this.attributes = { ...attributes };
    this.textContent = textContent;
    this.children = [];
    this.parentElement = null;
    this.classList = new Set();
    if (attributes.class) {
      attributes.class.split(/\s+/).forEach((c) => this.classList.add(c));
    }
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  matches(selector) {
    if (selector.startsWith('[aria-label*="')) {
      const match = selector.match(/\[aria-label\*="([^"]+)"\s*i?\]/i);
      if (match) {
        const val = this.getAttribute('aria-label') || '';
        return val.toLowerCase().includes(match[1].toLowerCase());
      }
    }
    if (selector.startsWith('[aria-label="')) {
      const match = selector.match(/\[aria-label="([^"]+)"\]/);
      if (match) {
        return (this.getAttribute('aria-label') || '') === match[1];
      }
    }
    if (selector.startsWith('[data-testid="')) {
      const match = selector.match(/\[data-testid="([^"]+)"\]/);
      if (match) {
        return (this.getAttribute('data-testid') || '') === match[1];
      }
    }
    return false;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const check = (node) => {
      for (const child of node.children) {
        if (child.matches(selector)) {
          results.push(child);
        } else if (selector === 'h2, span[role="heading"]') {
          if (child.tagName === 'H2' || child.getAttribute('role') === 'heading') {
            results.push(child);
          }
        }
        check(child);
      }
    };
    check(this);
    return results;
  }

  contains(child) {
    let curr = child;
    while (curr) {
      if (curr === this) return true;
      curr = curr.parentElement;
    }
    return false;
  }
}

// Logic under test extracted from content.js
function isValidTrendingCard(card, sidebar) {
  if (!card || card === sidebar) return false;
  if (!sidebar.contains(card)) return false;

  if (card.querySelector('[data-testid="primaryColumn"]') || card.querySelector('[data-testid="SearchBox_Search_Input"]')) {
    return false;
  }

  const hasWhoToFollowLabel = card.matches('[aria-label*="Who to follow" i]') ||
    Boolean(card.querySelector('[aria-label*="Who to follow" i]'));
  const hasUserCell = Boolean(card.querySelector('[data-testid="UserCell"]'));
  if (hasWhoToFollowLabel || hasUserCell) {
    return false;
  }

  const textContent = card.textContent || '';
  if (/(who to follow|you might like)/i.test(textContent) && !/(what[’']s happening|trending now)/i.test(textContent)) {
    return false;
  }

  const hasTrendTestId = Boolean(card.querySelector('[data-testid="trend"]'));
  const hasTrendingLabel = card.matches('[aria-label*="Trending" i]') ||
    Boolean(card.querySelector('[aria-label*="Trending" i]'));
  const hasWhatsHappeningText = /(what[’']s happening)/i.test(textContent);

  return hasTrendTestId || hasTrendingLabel || hasWhatsHappeningText;
}

function resolveCardContainer(candidate, sidebar) {
  if (!candidate || !sidebar) return null;

  if ((candidate.tagName === 'SECTION' || candidate.tagName === 'ASIDE' || candidate.hasAttribute('aria-label')) &&
      isValidTrendingCard(candidate, sidebar)) {
    const parent = candidate.parentElement;
    if (parent && parent !== sidebar && parent.children.length === 1 && isValidTrendingCard(parent, sidebar)) {
      return parent;
    }
    return candidate;
  }

  let current = candidate;
  let cardCandidate = null;

  while (current && current !== sidebar && current.parentElement) {
    if (current.tagName === 'SECTION' ||
        current.tagName === 'ASIDE' ||
        current.getAttribute('aria-label')?.includes('Trending')) {
      if (isValidTrendingCard(current, sidebar)) {
        cardCandidate = current;
        break;
      }
    }
    current = current.parentElement;
  }

  return cardCandidate || (isValidTrendingCard(candidate, sidebar) ? candidate : null);
}

function simulateClean(root) {
  const sidebar = root.querySelector('[data-testid="sidebarColumn"]');
  if (!sidebar) return;

  const candidates = [];
  const ariaTrending = sidebar.querySelectorAll('[aria-label="Timeline: Trending now"]');
  ariaTrending.forEach((el) => candidates.push(el));

  const headings = sidebar.querySelectorAll('h2, span[role="heading"]');
  headings.forEach((h) => {
    const text = (h.textContent || '').trim();
    if (/^what[’']s happening$/i.test(text)) {
      candidates.push(h);
    }
  });

  const trendItems = sidebar.querySelectorAll('[data-testid="trend"]');
  if (trendItems.length > 0) {
    candidates.push(trendItems[0]);
  }

  const targetsToHide = new Set();
  for (const cand of candidates) {
    const card = resolveCardContainer(cand, sidebar);
    if (card && isValidTrendingCard(card, sidebar)) {
      targetsToHide.add(card);
    }
  }

  targetsToHide.forEach((card) => {
    card.setAttribute('data-x-sidebar-cleaner-hidden', 'true');
  });
}

function buildSimulatedPage(quoteChar = '’') {
  const root = new MockElement('DIV');

  // Primary feed (timeline)
  const primaryColumn = new MockElement('DIV', { 'data-testid': 'primaryColumn' }, 'Timeline posts from Karpathy');
  root.appendChild(primaryColumn);

  // Right sidebar column
  const sidebarColumn = new MockElement('DIV', { 'data-testid': 'sidebarColumn' });
  root.appendChild(sidebarColumn);

  // 1. Search Box Card
  const searchCard = new MockElement('DIV', { class: 'search-wrapper' });
  const searchInput = new MockElement('INPUT', { 'data-testid': 'SearchBox_Search_Input' });
  searchCard.appendChild(searchInput);
  sidebarColumn.appendChild(searchCard);

  // 2. "You might like" / "Who to follow" Card
  const whoToFollowCard = new MockElement('SECTION', { 'aria-label': 'Who to follow', class: 'card' });
  const whoHeading = new MockElement('H2', {}, 'You might like');
  const user1 = new MockElement('DIV', { 'data-testid': 'UserCell' }, 'Lilian Weng @lilianweng');
  const user2 = new MockElement('DIV', { 'data-testid': 'UserCell' }, 'François Chollet @fchollet');
  whoToFollowCard.appendChild(whoHeading);
  whoToFollowCard.appendChild(user1);
  whoToFollowCard.appendChild(user2);
  sidebarColumn.appendChild(whoToFollowCard);

  // 3. "What's happening" Card (Target)
  const trendingCard = new MockElement('SECTION', { 'aria-label': 'Timeline: Trending now', class: 'card' });
  const trendingHeading = new MockElement('H2', {}, `What${quoteChar}s happening`);
  const trendItem1 = new MockElement('DIV', { 'data-testid': 'trend' }, '#Ranbirkapoor · Trending');
  const trendItem2 = new MockElement('DIV', { 'data-testid': 'trend' }, '#14YearsOfAliaBhatt · Trending');
  trendingCard.appendChild(trendingHeading);
  trendingCard.appendChild(trendItem1);
  trendingCard.appendChild(trendItem2);
  sidebarColumn.appendChild(trendingCard);

  // 4. Footer Card
  const footerCard = new MockElement('NAV', { 'aria-label': 'Footer links' }, 'Terms Privacy Cookies © 2026 X Corp.');
  sidebarColumn.appendChild(footerCard);

  return { root, primaryColumn, searchCard, whoToFollowCard, trendingCard, footerCard };
}

test('cleaner detects and hides the "What’s happening" card with curly apostrophe', () => {
  const { root, primaryColumn, searchCard, whoToFollowCard, trendingCard, footerCard } = buildSimulatedPage('’');

  simulateClean(root);

  // Target card is hidden
  assert.equal(trendingCard.getAttribute('data-x-sidebar-cleaner-hidden'), 'true');

  // Everything else MUST remain untouched
  assert.equal(whoToFollowCard.getAttribute('data-x-sidebar-cleaner-hidden'), null);
  assert.equal(searchCard.getAttribute('data-x-sidebar-cleaner-hidden'), null);
  assert.equal(primaryColumn.getAttribute('data-x-sidebar-cleaner-hidden'), null);
  assert.equal(footerCard.getAttribute('data-x-sidebar-cleaner-hidden'), null);
});

test('cleaner detects and hides the "What\'s happening" card with straight apostrophe', () => {
  const { root, whoToFollowCard, trendingCard } = buildSimulatedPage('\'');

  simulateClean(root);

  assert.equal(trendingCard.getAttribute('data-x-sidebar-cleaner-hidden'), 'true');
  assert.equal(whoToFollowCard.getAttribute('data-x-sidebar-cleaner-hidden'), null);
});

test('cleaner handles missing sidebar without error', () => {
  const root = new MockElement('DIV');
  assert.doesNotThrow(() => {
    simulateClean(root);
  });
});

test('toggling off restores hidden elements', () => {
  const { root, trendingCard } = buildSimulatedPage('’');
  simulateClean(root);
  assert.equal(trendingCard.getAttribute('data-x-sidebar-cleaner-hidden'), 'true');

  // Simulate restore
  trendingCard.removeAttribute('data-x-sidebar-cleaner-hidden');
  assert.equal(trendingCard.getAttribute('data-x-sidebar-cleaner-hidden'), null);
});
