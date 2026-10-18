<div align="center">

<img src="icon/icon.svg" width="96" height="96" alt="IP Lens logo">

# IP Lens

**See your public IP address, location and internet provider in one click.**

A minimal Chrome extension with a clean red-and-black interface.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-e11d2e?style=flat-square)
![Chrome](https://img.shields.io/badge/Chrome-extension-000000?style=flat-square&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-e11d2e?style=flat-square)

</div>

---

## Overview

IP Lens adds a small popup to your browser toolbar. Click it and you instantly see what the internet sees when you connect: your public IP, the country and city it maps to, and the network provider behind it.

It is handy for developers, testers and anyone who wants to quickly check their connection, for example after switching networks or connecting through a proxy or VPN.

<!-- Add a screenshot at docs/screenshot.png and uncomment the line below
<p align="center"><img src="docs/screenshot.png" width="320" alt="IP Lens popup"></p>
-->

## Features

- **Public IP address**, with an IPv4 / IPv6 badge
- **One-click copy** to the clipboard
- **Country** with its flag, plus **city and region**
- **Internet provider (ISP)** and **ASN**
- **Time zone** of the detected location
- **Automatic fallback** between lookup services if one is unavailable
- **Refresh button** to re-check after changing network or proxy
- **Loading and error states**, with a retry button when you are offline
- **No tracking, no accounts, no data stored**

## Installation

IP Lens is not on the Chrome Web Store yet, so install it as an unpacked extension:

1. Download or clone this repository.
   ```bash
   git clone https://github.com/Sobtechno/ip-lens.git
   ```
2. Open `chrome://extensions` in Chrome (or any Chromium browser such as Edge, Brave or Opera).
3. Turn on **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the project folder (the one containing `manifest.json`).
5. Pin the IP Lens icon from the puzzle-piece menu so it stays on your toolbar.

## Usage

Click the IP Lens icon. The popup loads your details right away.

| Action | What it does |
| --- | --- |
| **Copy** | Copies your IP address to the clipboard |
| **Refresh** (top right) | Looks up your connection again |
| **Try again** | Appears if the lookup fails, for example when you are offline |

## How it works

When the popup opens, it asks a public IP geolocation API for details about the connection that made the request. The services are tried in order until one answers:

1. [`ipwho.is`](https://ipwho.is)
2. [`ipapi.co`](https://ipapi.co)

Country flags are loaded as SVG images from [`flagcdn.com`](https://flagcdn.com). If a flag fails to load, it is simply hidden.

## Permissions

IP Lens asks for the minimum it needs:

| Permission | Why |
| --- | --- |
| `host_permissions` for `ipwho.is` and `ipapi.co` | To fetch your IP and location data |

It does not read or modify any web page, and it does not request access to your tabs, history or browsing data.

## Privacy

- IP Lens has no backend and no analytics.
- Nothing is saved: no IP history, no logs, no cookies.
- Your IP is only sent to the lookup services listed above, which is unavoidable because they need it to answer. Their own privacy policies apply to those requests.
- Flag images are requested from `flagcdn.com`.

## Project structure

```
ip-lens/
├── manifest.json     # Extension manifest (Manifest V3)
├── popup.html        # Popup markup
├── popup.css         # Red and black theme
├── popup.js          # Lookup logic, fallback, copy and refresh
└── icons/
    ├── icon.svg      # Source logo, also used inside the popup
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Customization

The whole theme is defined by a few CSS variables at the top of `popup.css`. To change the accent color, edit `--red`:

```css
:root {
  --bg: #000;
  --surface: #0e0e0e;
  --line: #1f1f1f;
  --text: #f2f2f2;
  --muted: #7d7d7d;
  --red: #e11d2e;
}
```

> Chrome requires PNG icons in `manifest.json`. If you change `icons/icon.svg`, export new `icon16.png`, `icon48.png` and `icon128.png` files from it.

## Limitations

- Geolocation from an IP address is approximate. City-level results can be wrong, especially on mobile networks, VPNs and proxies.
- The free lookup services may rate-limit heavy use.
- The extension shows the IP of the connection the browser is using. If you are behind a VPN or proxy, that is the address you will see.

## Contributing

Issues and pull requests are welcome. For larger changes, please open an issue first to discuss what you would like to change.

## License

Released under the [MIT License](LICENSE).
