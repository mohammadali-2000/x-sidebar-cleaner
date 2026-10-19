# Chrome Web Store Listing — X Sidebar Cleaner

> **Status:** Production Ready for Submission  
> **Last Updated:** 2026-10-19  
> **Version:** 1.0.0  
> **Dashboard URL:** [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)

This document contains all exact metadata, descriptions, graphics inventory, permission justifications, and privacy disclosures needed to publish **X Sidebar Cleaner** to the Google Chrome Web Store. Copy and paste each section directly into the Chrome Developer Dashboard.

---

## 1. Store Listing Details

### Extension Name [REQUIRED]
```text
X Sidebar Cleaner
```
*(17 characters / max 75)*

### Short Description [REQUIRED]
```text
Removes the 'What’s happening' trending sidebar, hashtags, and promoted ads from X while keeping Who to Follow and your timeline.
```
*(127 characters / max 132)*

### Detailed Description [REQUIRED]
```text
X Sidebar Cleaner removes the distracting "What’s happening" trending card, promoted advertisements, and viral hashtags from your X (formerly Twitter) sidebar — giving you a clean, focused reading experience while keeping recommended accounts ("Who to follow") and your search bar completely intact.

KEY BENEFITS & FEATURES:
• Clean Focus Space: Automatically removes the trending topics, breaking hashtags, and promoted sponsored tags from the right-hand sidebar.
• Preserves What You Need: Keeps "Who to follow" / "You might like", the search box, your main timeline, and left navigation menus untouched and fully functional.
• Zero Flickering (No FOUC): Injected immediately before page layout paints, so you never see the trending box flash when opening X.
• Seamless Navigation: Continues working smoothly as you click across profiles, bookmarks, lists, and notifications without requiring page reloads.
• Interactive Toggle Switch: Turn cleaning ON or OFF anytime with one click in the browser toolbar. Changes take effect instantly without restarting your browser.
• Light & Fast: Pure client-side code with zero dependencies. Runs quietly in the background without slowing down your browser.

HOW TO USE:
1. Install X Sidebar Cleaner from the Chrome Web Store.
2. Open or refresh any page on x.com or twitter.com.
3. The "What’s happening" trending card is automatically hidden.
4. Click the extension icon in your Chrome toolbar anytime to toggle the cleaner on or off.

PRIVACY & PERMISSIONS:
Your privacy is fully protected:
• 100% offline client-side execution.
• Zero analytics, zero telemetry, and zero tracking.
• No passwords, cookies, direct messages, or personal information are ever read or collected.
• Requests only the "storage" permission to remember whether your toggle switch is active.

SUPPORT & OPEN SOURCE:
X Sidebar Cleaner is free and open-source under the MIT license.
Source code & issue tracker: https://github.com/mohammadali-2000/x-sidebar-cleaner
```

### Category [REQUIRED]
* **Primary Category:** `Productivity`
* **Secondary Category:** `Social & Communication`

### Single Purpose [REQUIRED]
```text
Removes the trending topics and promoted sidebar card on X (Twitter) to reduce distraction while preserving recommended follows and timeline navigation.
```

### Primary Language [REQUIRED]
```text
English
```

---

## 2. Graphics & Promotional Assets

All required graphics have been generated at exact pixel dimensions and are located in the `promo/` and `icons/` folders:

| Asset | Dimensions | Status | Location | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Store Icon** [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` | Appears in store search results and listings. |
| **Screenshot 1** [REQUIRED] | 1280×800 PNG | ✅ Ready | `promo/store-screenshot-1.png` | Demonstrates Before vs. After with trending section cleanly removed. |
| **Screenshot 2** [REQUIRED] | 1280×800 PNG | ✅ Ready | `promo/store-screenshot-2.png` | Showcases the popup toggle, zero FOUC, and privacy guarantees. |
| **Small Promo Tile** [RECOMMENDED] | 440×280 PNG | ✅ Ready | `promo/small-promo-440x280.png` | Shown on Chrome Web Store category pages and recommendations. |
| **Marquee Promo Tile** [RECOMMENDED] | 1400×560 PNG | ✅ Ready | `promo/marquee-promo-1400x560.png` | Featured banner on top of the Chrome Web Store home page. |

---

## 3. Permissions Justification (For Review Team)

The Chrome Web Store review team inspects every permission. Copy and paste these exact plain-English explanations:

| Permission | Type | Plain-English Justification for Reviewer |
| :--- | :--- | :--- |
| **`storage`** | `permissions` | Required solely to save and persist the user's enabled/disabled toggle preference across browser sessions using chrome.storage.sync. |
| **`https://x.com/*`** | `host_permissions` | Required to inject the content script and stylesheet to detect and hide the "What’s happening" trending card on X. |
| **`https://twitter.com/*`** | `host_permissions` | Required to maintain identical distraction-free functionality when users access Twitter via legacy twitter.com URLs. |

---

## 4. Privacy & Data Use Declarations

Fill out the **Privacy** tab in the Chrome Developer Dashboard as follows:

### Single Purpose Compliance
- [x] **Yes**, the extension has a single, narrow purpose (removing trending sidebar clutter on X).

### Permission Justification Compliance
- [x] **Yes**, the extension only requests permissions directly relevant to its core functionality.

### Data Collection Declarations
* **Does the extension collect user data?** ➔ **NO**

| Data Category | Collected? | Transmitted Off-Device? |
| :--- | :--- | :--- |
| Personally identifiable information (name, email) | **No** | No |
| Health information | **No** | No |
| Financial and payment information | **No** | No |
| Authentication information (passwords, credentials) | **No** | No |
| Personal communications (DMs, emails) | **No** | No |
| Location | **No** | No |
| User activity (keystrokes, mouse events) | **No** | No |
| Website content | **No** | No |

### Data Use Certification Checkboxes
Ensure all three certifications are checked:
- [x] **The extension does not sell user data to third parties.**
- [x] **The extension does not use or transfer user data for purposes unrelated to the item's core functionality.**
- [x] **The extension does not use or transfer user data to determine creditworthiness or for lending purposes.**

### Privacy Policy URL [REQUIRED]
```text
https://github.com/mohammadali-2000/x-sidebar-cleaner/blob/main/PRIVACY.md
```

---

## 5. Distribution Settings

* **Visibility:** `Public`
* **Geographic Distribution:** `All regions` (worldwide)
* **Pricing:** `Free` (no in-app purchases)

---

## 6. Developer & Support Information

* **Publisher Name:** Syed Mohammad Ali
* **Support URL:** `https://github.com/mohammadali-2000/x-sidebar-cleaner/issues`
* **Homepage URL:** `https://github.com/mohammadali-2000/x-sidebar-cleaner`
