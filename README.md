# BrowserBeast™ v1.0

**Chrome Extension · Freeware · Open Source**

Capture. Export. Enjoy.

BrowserBeast™ turns web pages, AI chats, research trails, documentation, and
highlighted text into durable local Markdown or plain-text records. Captures
include useful source metadata, an Evidence Envelope, and advisory privacy
signals so they can be stored, recalled, and reviewed later.

BrowserBeast is user-triggered and local-first. It does not require an account,
run automatic background capture, or upload captured content to AI Underground.

Project home: https://ai-underground.ai/

## Why BrowserBeast exists

Copy and paste loses context. Screenshots are difficult to search. BrowserBeast
preserves the readable content together with where it came from, when it was
captured, how it was captured, and which tool produced the artifact.

## Features

- Full Render capture for readable page content.
- Highlighted Text capture for user-selected content.
- Markdown and plain-text export.
- Local Full Review tab for large captures.
- Evidence Envelope v0.2 embedded in Markdown exports.
- Advisory detection of logged-in, account, profile, workspace, and similar
  privacy signals.
- Artifact-ID-based Markdown filenames.
- Chrome Manifest V3 with no third-party dependencies or build framework.

## Install from a release ZIP

1. Download and unzip `BrowserBeast-v1.0.zip`.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the unzipped `BrowserBeast-v1.0` folder.
6. Pin BrowserBeast to the toolbar if desired.

See [INSTALL.md](INSTALL.md) for clean-clone and Chromium-browser instructions.

## Use

1. Open the page or AI chat you want to capture.
2. Click the BrowserBeast toolbar button.
3. Choose **Full Render** or **Highlighted Text**.
4. Review the preview and any privacy warning.
5. Open Full Review, copy Markdown, download `.md`, or copy plain text.
6. Review the exported artifact before sharing it.

## Build from a clean clone

BrowserBeast uses vanilla JavaScript and has no compilation step.

```sh
git clone https://github.com/DuskStormcrow/BrowserBeast.git
cd BrowserBeast
python scripts/package_release.py
```

The packaging script validates the allowlist in `RELEASE_FILES.txt` and creates
`dist/BrowserBeast-v1.0.zip`. Given identical source files, it creates the same
ZIP contents and timestamps on every supported platform.

To test without creating a ZIP, load the repository root with Chrome's
**Load unpacked** action.

## Evidence Envelope v0.2

Markdown exports contain a structured `evidence-envelope` block with these
top-level sections:

- `artifact`
- `source`
- `content`
- `privacy`
- `validation`
- `identity`
- `integrity`
- `links`

Identity, integrity, and relationship fields may be blank when BrowserBeast does
not know those values. The envelope records provenance; it does not certify a
capture or make it safe to share.

## Privacy and limitations

BrowserBeast can capture private or logged-in content when the user chooses to
capture that page. Privacy detection is advisory and may miss sensitive content.
Always review an artifact before publishing, uploading, emailing, or sending it
to another person or AI system.

Browser-internal pages, some browser-native PDF viewers, iframe content, and some
third-party widgets may not expose capturable text. Captures are capped at 150,000
characters. See [PRIVACY_AND_LIMITATIONS.md](PRIVACY_AND_LIMITATIONS.md).

## Repository map

- `background.js` — user-triggered page capture and privacy-signal detection.
- `popup/` — capture, preview, and export interface.
- `review/` — local full-review surface.
- `icons/` — extension icons.
- `samples/` — public example artifacts.
- `scripts/package_release.py` — deterministic release ZIP generator.
- `RELEASE_FILES.txt` — exact release-package allowlist.

## Contributing and security

Contributions are welcome when they preserve BrowserBeast's focused, local-first
design. Read [CONTRIBUTING.md](CONTRIBUTING.md) and [PHILOSOPHY.md](PHILOSOPHY.md)
before proposing a change.

Please report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Contact

Primary: `stormcrow@ai-underground.ai`  
Fallback: `duskstormcrow@gmail.com`

## License and marks

BrowserBeast source code is released under the [MIT License](LICENSE.txt).

BrowserBeast™, TechBeast™, AI Underground™, their names, logos, and visual
branding are trademarks or identifying marks of their respective owner. The MIT
License covers the software; it does not grant rights to represent a modified or
third-party product as an official AI Underground release.
