# BrowserBeast™ v1.0.1 Freeware

Capture. Export. Enjoy.

BrowserBeast™ is a free Chrome-compatible browser extension for turning web pages,
AI chats, research pages, documentation, and selected text into clean Markdown or
plain text artifacts.

BrowserBeast™ v1.0.1 is Markdown-first. The Markdown export is the source-of-truth
artifact. Evidence Envelope v0.2 adds structured metadata inside the Markdown
export so captures can be reviewed, searched, indexed, and reused later.

BrowserBeast™ v1.0.1 Freeware is included inside the DesktopBeast™ v1.0 EA RC2
ZIP as an intentional companion tool. BrowserBeast captures browser/web artifacts.
DesktopBeast captures desktop/application/window artifacts. BrowserBeast is loaded
separately as a browser extension; installing or running DesktopBeast does not
automatically install BrowserBeast.

## What BrowserBeast Does

- Captures readable text from the current browser page.
- Captures highlighted text selected by the user.
- Exports clean Markdown.
- Exports plain text with a metadata header.
- Opens captured Markdown in a larger local Full Review tab for serious review.
- Preserves source URL, title, timestamp, word count, capture mode, detected
  platform, browser, and engine metadata.
- Emits an Evidence Envelope v0.2 block in Markdown exports.
- Warns when private, logged-in, account, profile, or workspace indicators are
  detected.

## What BrowserBeast Does Not Do

- It does not run background auto-capture.
- It does not upload captured content to AI Underground.
- It does not require an account or cloud service.
- It does not capture full-page PNG screenshots in v1.0.1.
- It does not stitch screenshots.
- It does not parse ArchiveBeast records.
- It does not run PersonaVault identity logic.
- It does not add hash chains, embeddings, trust scoring, or runtime identity
  state.

## Install / Load Unpacked

BrowserBeast™ v1.0.1 Freeware is distributed as an unpacked extension folder for
freeware release sideloading.

1. Download and unzip `BrowserBeast-v1.0.1-Freeware.zip`, or open the included
   BrowserBeast folder inside the DesktopBeast ZIP after extracting DesktopBeast.
2. Open Chrome or a Chromium-based browser.
3. Go to `chrome://extensions`.
4. Enable `Developer mode`.
5. Click `Load unpacked`.
6. Select the unzipped `BrowserBeast-v1.0.1-Freeware` folder.
7. Pin BrowserBeast from the extensions menu if you want quick toolbar access.

Chromium-based browsers such as Edge, Brave, Opera, and Vivaldi may use similar
extension-loading screens.

## Basic Usage

1. Open the page or AI chat you want to capture.
2. Click the BrowserBeast toolbar button.
3. Choose `Full Render` or `Highlighted Text`.
4. Review the preview and privacy warnings.
5. Use `Open Full Review` for a larger local review tab when the popup preview is
   too small.
6. Copy Markdown, download `.md`, or copy plain text.
7. Review exported artifacts before sharing.

## DesktopBeast Companion Notes

ArchiveBeast™ Library can review BrowserBeast Markdown captures when the Browser
shelf is pointed at the folder containing those Markdown files. BrowserBeast does
not automatically sync into ArchiveBeast yet.

## Export Format

Markdown exports include:

- Human-readable title and metadata header.
- Optional advisory warnings.
- Evidence Envelope v0.2 structured metadata block.
- Captured content.

The human-readable header remains for ordinary users. The Evidence Envelope
exists for structured artifact handling.

## Evidence Envelope v0.2

BrowserBeast v1.0.1 emits:

```yaml
evidence_envelope_version: "0.2"
```

The envelope includes these required top-level sections:

- `artifact`
- `source`
- `content`
- `privacy`
- `validation`
- `identity`
- `links`

Identity fields are present but may be blank when BrowserBeast does not know the
associated identity. This keeps v1.0.1 useful for normal capture workflows while
remaining ready for future continuity-layer tools.

## Privacy Warning

BrowserBeast™ can capture content from private or logged-in pages when you choose
to capture those pages. The tool may detect advisory privacy signals, but it
cannot guarantee that an export is safe to share.

Review captures before sharing. BrowserBeast™ may preserve private/logged-in
indicators or page content visible at capture time.

Always review captures before sharing, publishing, uploading, emailing, or
sending them to an AI system.

## Known Limitations

- Browser-internal pages such as `chrome://`, `edge://`, and `about:` cannot be
  captured.
- Very long captures are capped at 150,000 characters.
- Browser-native PDF viewers may not expose readable page text.
- iframe content and third-party embedded widgets may not be captured.
- Noisy pages may include menus, banners, navigation, or unrelated text.
- Privacy warnings are advisory only.
- PNG Visual Companion capture is feasible but deferred beyond v1.0.1.

## Release Milestone

BrowserBeast v1.0.1 adds optional Full Review while preserving the Markdown-first
v1.0 freeware release behavior.

Evidence Envelope v0.2 is green. Visual Companion remains deferred.

## License

BrowserBeast™ is freeware. See `LICENSE.txt`.
