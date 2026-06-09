# BrowserBeast™ v1.0.1 Sideload Test Checklist

**Build:** BrowserBeast-v1.0.1-Freeware.zip
**Target browsers:** Chrome primary; Edge optional smoke test

## Pre-Flight

- [ ] Unzip `BrowserBeast-v1.0.1-Freeware.zip` into a clean folder.
- [ ] Open `chrome://extensions`.
- [ ] Enable Developer mode.
- [ ] Click **Load unpacked** and select the BrowserBeast folder.
- [ ] Extension loads without errors.
- [ ] Existing extension permissions are unchanged.

## Branding Verification

- [ ] Extension name shows **BrowserBeast**.
- [ ] Toolbar tooltip shows **BrowserBeast - Capture. Export. Enjoy.**
- [ ] Popup header shows **BrowserBeast™**.
- [ ] Footer shows **BrowserBeast v1.0.1**.
- [ ] Engine field shows **BrowserBeast v1.0.1** after capture.

## Full Render

- [ ] Navigate to a normal webpage.
- [ ] Open BrowserBeast and click **Full Render**.
- [ ] Preview stage appears with metadata populated.
- [ ] **Copy Markdown** produces Markdown with source URL, timestamp, word count, capture mode, platform, browser, and engine.
- [ ] **Open Full Review** opens a readable local review tab.
- [ ] Script-like text such as `<script>alert("nope")</script>` displays literally in Full Review and does not execute.
- [ ] **Download .md** produces a `BrowserBeast_<Platform>_FullRender_<date>_<time>.md` file.
- [ ] **Copy Plain Text** includes the metadata header.

## Highlighted Text

- [ ] Select text on a webpage.
- [ ] Open BrowserBeast.
- [ ] Highlighted Text hint appears.
- [ ] Click **Highlighted Text**.
- [ ] Capture contains only selected text.
- [ ] Selection note appears in preview and exports.

## DesktopBeast Companion

- [ ] Docs explain BrowserBeast captures browser/web artifacts.
- [ ] Docs explain DesktopBeast captures desktop/application/window artifacts.
- [ ] Docs explain BrowserBeast is bundled as a companion extension.
- [ ] Docs explain BrowserBeast is loaded separately.
- [ ] Docs explain ArchiveBeast can review BrowserBeast Markdown captures when pointed at the capture folder.
- [ ] Docs explain BrowserBeast does not automatically sync into ArchiveBeast yet.
