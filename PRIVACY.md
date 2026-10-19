# Privacy Policy for X Sidebar Cleaner

**Last Updated:** October 19, 2026

**Effective Date:** October 19, 2026

**Extension Name:** X Sidebar Cleaner  
**Developer:** Syed Mohammad Ali ([https://github.com/mohammadali-2000](https://github.com/mohammadali-2000))  
**Repository:** [https://github.com/mohammadali-2000/x-sidebar-cleaner](https://github.com/mohammadali-2000/x-sidebar-cleaner)

---

## 1. Overview and Core Philosophy

**X Sidebar Cleaner** is built with an absolute privacy-first philosophy. The extension operates entirely locally within your browser client. It is designed to remove the "What’s happening" trending card and advertisements on X (formerly Twitter) without inspecting, collecting, or transmitting any personal data.

## 2. Information We Do NOT Collect

X Sidebar Cleaner:
* **Does NOT collect** any Personally Identifiable Information (PII) such as your name, email, phone number, physical address, or account credentials.
* **Does NOT collect, read, or transmit** your posts, bookmarks, direct messages, browsing history, or feed contents.
* **Does NOT log or track** keystrokes, mouse clicks, or interactions outside the extension’s own popup toggle.
* **Does NOT track** IP addresses, location data, or device hardware identifiers.
* **Does NOT use cookies**, web beacons, tracking pixels, or third-party analytics services (such as Google Analytics or Mixpanel).
* **Does NOT send any network requests** off your device. The extension makes zero remote API calls.

## 3. Data Stored Locally on Your Device

The extension utilizes only the standard browser storage API (`chrome.storage.sync` with fallback to `chrome.storage.local`):

| Stored Key | Purpose | Transmitted Off Device? |
| :--- | :--- | :--- |
| `enabled` (`true` / `false`) | Remembers whether the user toggled the sidebar cleaner ON or OFF. | **No** (synced solely across the user's logged-in Chrome devices via standard Google account sync). |

You can reset or remove this stored preference at any time by uninstalling the extension or clearing extension data via `chrome://extensions`.

## 4. Permissions Disclosure and Hygiene

The extension requests the minimum permissions required to perform its single purpose:

* **`storage`:** Required solely to persist the user's toggle setting (`enabled: true/false`) between browser sessions.
* **Host Permissions (`https://x.com/*`, `https://twitter.com/*`):** Required exclusively to inject the local content script and CSS rules into X/Twitter web pages to detect and hide the "What’s happening" card. No other websites are accessed.

## 5. Third-Party Sharing and Sale of Data

* **Zero Sale of Data:** We do not sell, rent, trade, or monetize user data in any manner.
* **Zero Third-Party Sharing:** No data is shared with data brokers, advertising partners, analytics platforms, or external services.
* **Zero Credit or Lending Use:** No data is used to evaluate creditworthiness or for financial lending purposes.

## 6. Single Purpose Compliance

In accordance with Google Chrome Web Store Single Purpose Policy, X Sidebar Cleaner has one narrow function: hiding the "What’s happening" trending card on X (Twitter) while keeping "Who to follow", search, and the main timeline visible.

## 7. Open Source and Auditability

The complete source code of X Sidebar Cleaner is publicly available under the MIT License at:  
[https://github.com/mohammadali-2000/x-sidebar-cleaner](https://github.com/mohammadali-2000/x-sidebar-cleaner)

Anyone can inspect, build, or audit the code independently.

## 8. Changes to This Privacy Policy

If any changes are made to how the extension operates, this document will be updated directly in the GitHub repository with an updated revision date.

## 9. Contact and Inquiries

For questions, feedback, or security reports, please open an issue on GitHub:  
[https://github.com/mohammadali-2000/x-sidebar-cleaner/issues](https://github.com/mohammadali-2000/x-sidebar-cleaner/issues)
