/**
 * Automated Test: Manifest V3 Compliance & Asset Validation
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('manifest.json conforms to Chrome Manifest V3 specifications', () => {
  const manifestPath = path.join(rootDir, 'manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'manifest.json must exist');

  const raw = fs.readFileSync(manifestPath, 'utf8');
  let manifest;
  assert.doesNotThrow(() => {
    manifest = JSON.parse(raw);
  }, 'manifest.json must be valid JSON');

  // MV3 rules
  assert.equal(manifest.manifest_version, 3, 'manifest_version must be 3');
  assert.ok(manifest.name && manifest.name.length > 0, 'name must be defined');
  assert.ok(manifest.version && manifest.version.length > 0, 'version must be defined');
  assert.ok(manifest.description && manifest.description.length > 0, 'description must be defined');

  // No V2 relics
  assert.equal(manifest.browser_action, undefined, 'Must not use browser_action');
  assert.equal(manifest.background?.scripts, undefined, 'Must not use background.scripts');

  // Permissions hygiene
  assert.deepEqual(manifest.permissions, ['storage'], 'Must only request minimal storage permission');
  assert.ok(Array.isArray(manifest.host_permissions), 'host_permissions must be an array');
  assert.ok(manifest.host_permissions.includes('https://x.com/*'), 'Must include https://x.com/*');
  assert.ok(manifest.host_permissions.includes('https://twitter.com/*'), 'Must include https://twitter.com/*');

  // Verify all declared icon files exist on disk
  assert.ok(manifest.icons, 'icons must be declared');
  for (const [size, iconPath] of Object.entries(manifest.icons)) {
    const fullPath = path.join(rootDir, iconPath);
    assert.ok(fs.existsSync(fullPath), `Icon file for size ${size} must exist at ${iconPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Icon file ${iconPath} must not be empty`);
  }

  // Verify action popup
  assert.ok(manifest.action, 'action must be declared');
  assert.ok(manifest.action.default_popup, 'default_popup must be declared');
  const popupPath = path.join(rootDir, manifest.action.default_popup);
  assert.ok(fs.existsSync(popupPath), 'Popup HTML must exist on disk');

  // Verify content scripts
  assert.ok(Array.isArray(manifest.content_scripts), 'content_scripts must be an array');
  assert.ok(manifest.content_scripts.length > 0, 'At least one content script entry required');
  for (const cs of manifest.content_scripts) {
    if (cs.js) {
      for (const jsFile of cs.js) {
        assert.ok(fs.existsSync(path.join(rootDir, jsFile)), `Content script JS ${jsFile} must exist`);
      }
    }
    if (cs.css) {
      for (const cssFile of cs.css) {
        assert.ok(fs.existsSync(path.join(rootDir, cssFile)), `Content script CSS ${cssFile} must exist`);
      }
    }
  }
});
