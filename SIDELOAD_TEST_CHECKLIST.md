# BrowserBeast™ v1.0.1 Post-Install Verification

Use these steps to confirm your BrowserBeast installation is working correctly.

**Target browsers:** Chrome primary; Edge optional smoke test

## Installation

- [ ] Unzip `BrowserBeast-v1.0.1-Freeware.zip` into a clean folder.
- [ ] Open `chrome://extensions`.
- [ ] Enable Developer mode.
- [ ] Click **Load unpacked** and select the BrowserBeast folder.
- [ ] Extension loads without errors.

## Branding

- [ ] Extension name shows **BrowserBeast**.
- [ ] Toolbar tooltip shows **BrowserBeast — Capture. Export. Enjoy.**
- [ ] Popup header shows **BrowserBeast™**.
- [ ] Footer shows **BrowserBeast v1.0.1**.
- [ ] TOOL field shows **BrowserBeast v1.0.1** after capture.

## Full Render

- [ ] Navigate to a normal webpage.
- [ ] Open BrowserBeast and click **Full Render**.
- [ ] Preview stage appears with metadata populated.
- [ ] **Copy Markdown** produces Markdown with source URL, timestamp, word count, capture mode, platform, browser, and tool.
- [ ] **Open Full Review** opens a readable local review tab.
- [ ] Script-like text such as `<script>alert("nope")</script>` displays literally in Full Review and does not execute.
- [ ] **Download .md** produces a file named after the artifact ID.
- [ ] **Copy Plain Text** includes the metadata header.

## Highlighted Text

- [ ] Select text on a webpage.
- [ ] Open BrowserBeast.
- [ ] Highlighted Text hint appears.
- [ ] Click **Highlighted Text**.
- [ ] Capture contains only the selected text.
- [ ] Selection note appears in preview and exports.

## Export Verification

- [ ] Markdown contains `evidence_envelope_version: "0.2"`.
- [ ] Evidence Envelope contains artifact, source, content, privacy, validation,
  identity, integrity, and links sections.
- [ ] A capture from a logged-in page displays an advisory privacy warning.
- [ ] No routine debug messages appear in the extension service worker console.

Project home: https://ai-underground.ai/
