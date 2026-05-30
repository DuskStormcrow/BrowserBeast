# BrowserBeast™ v1.0 Freeware

![TechBeast™ Data Capture Suite shared beast-monitor mark](docs/assets/techbeast-suite-mark-widescreen.jpg)

Capture. Export. Enjoy.

BrowserBeast™ is a free Chrome-compatible browser extension for turning web pages,
AI chats, research pages, documentation, and selected text into clean Markdown or
plain text artifacts.

BrowserBeast™ is the browser/web capture tool in the AI Underground TechBeast™ Data Capture Suite. AI Underground is the publisher and home base; TechBeast™ Suite is the software family that also includes DesktopBeast™ and ArchiveBeast™.

The beast-monitor mark shown above is the shared TechBeast™ Data Capture Suite logo family used across BrowserBeast™, DesktopBeast™, ArchiveBeast™, and suite materials. Product-specific variants may be created later; BrowserBeast™ v1.0 Freeware currently uses the shared suite mark for README/release branding.

Official site path, once deployed: `https://ai-underground.ai/browserbeast/`

Public release: `https://github.com/DuskStormcrow/BrowserBeastv1.0-freeware/releases/tag/v1.0`

BrowserBeast™ v1.0 is Markdown-first. The Markdown export is the source-of-truth
artifact. Evidence Envelope v0.1 adds structured metadata inside the Markdown
export so captures can be reviewed, searched, indexed, and reused later.

## What BrowserBeast™ Does

- Captures readable text from the current browser page.
- Captures highlighted text selected by the user.
- Exports clean Markdown.
- Exports plain text with a metadata header.
- Preserves source URL, title, timestamp, word count, capture mode, detected
  platform, browser, and engine metadata.
- Emits an Evidence Envelope v0.1 block in Markdown exports.
- Warns when private, logged-in, account, profile, or workspace indicators are
  detected.

## What BrowserBeast™ Does Not Do

- It does not run background auto-capture.
- It does not upload captured content to AI Underground.
- It does not require an account or cloud service.
- It does not capture full-page PNG screenshots in v1.0.
- It does not stitch screenshots.
- It does not parse ArchiveBeast™ records.
- It does not run PersonaVault identity logic.
- It does not add hash chains, embeddings, trust scoring, or runtime identity
  state.

## Install / Load Unpacked

BrowserBeast™ v1.0 Freeware is distributed as an unpacked extension folder for
freeware release sideloading.

1. Download and unzip `BrowserBeast-v1.0-Freeware.zip`.
2. Open Chrome or a Chromium-based browser.
3. Go to `chrome://extensions`.
4. Enable `Developer mode`.
5. Click `Load unpacked`.
6. Select the unzipped `BrowserBeast-v1.0-Freeware` folder.
7. Pin BrowserBeast™ from the extensions menu if you want quick toolbar access.

Chromium-based browsers such as Edge, Brave, Opera, and Vivaldi may use similar
extension-loading screens.

## Basic Usage

1. Open the page or AI chat you want to capture.
2. Click the BrowserBeast™ toolbar button.
3. Choose `Full Render` or `Highlighted Text`.
4. Review the preview and privacy warnings.
5. Copy Markdown, download `.md`, or copy plain text.
6. Review exported artifacts before sharing.

## Export Format

Markdown exports include:

- Human-readable title and metadata header.
- Optional advisory warnings.
- Evidence Envelope v0.1 structured metadata block.
- Captured content.

The human-readable header remains for ordinary users. The Evidence Envelope
exists for structured artifact handling.

## Evidence Envelope v0.1

BrowserBeast™ v1.0 emits:

```yaml
evidence_envelope_version: "0.1"
```

The envelope includes these required top-level sections:

- `artifact`
- `source`
- `content`
- `privacy`
- `validation`
- `identity`
- `links`

Identity fields are present but may be blank when BrowserBeast™ does not know the
associated identity. This keeps v1.0 useful for normal capture workflows while
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
- PNG Visual Companion capture is feasible but deferred to BrowserBeast™ v1.1.

## Release Milestone

Spike EE-001 + VC-001 Closed: BrowserBeast™ Markdown-First Release Ready

Evidence Envelope v0.1 is green. Visual Companion is deferred to v1.1.

## License

BrowserBeast™ is freeware. See `LICENSE.txt`.
