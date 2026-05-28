# BrowserBeast™ v1.0 Sideload Test Checklist

**Build:** BrowserBeast-v1.0-Freeware.zip  
**Target browsers:** Chrome primary; Edge and Brave smoke test

---

## Pre-Flight

- [ ] Unzip `BrowserBeast-v1.0-Freeware.zip` into a clean folder.
- [ ] Open `chrome://extensions`.
- [ ] Enable Developer mode.
- [ ] Click **Load unpacked** and select the BrowserBeast folder.
- [ ] Extension loads without errors.
- [ ] BB toolbar icon appears.

## Branding Verification

- [ ] Extension name shows **BrowserBeast**.
- [ ] Toolbar tooltip shows **BrowserBeast - Capture. Export. Enjoy.**
- [ ] Popup header shows **BrowserBeast™**.
- [ ] Popup tagline shows **Capture. Export. Enjoy.**
- [ ] Footer shows **BrowserBeast v1.0**.
- [ ] Engine field shows **BrowserBeast v1.0** after capture.

## Full Render

- [ ] Navigate to a normal webpage.
- [ ] Open BrowserBeast and click **Full Render**.
- [ ] Status changes to capture progress and then word/character count.
- [ ] Preview stage appears with metadata populated.
- [ ] **Copy Markdown** produces Markdown with source URL, timestamp, word count, capture mode, platform, browser, and engine.
- [ ] **Download .md** produces a `BrowserBeast_<Platform>_FullRender_<date>_<time>.md` file.
- [ ] **Copy Plain Text** includes the metadata header.
- [ ] **New Capture** returns to the capture stage.
- [ ] **Clear / Reset** clears content.

## Highlighted Text

- [ ] Select text on a webpage.
- [ ] Open BrowserBeast.
- [ ] Highlighted Text hint appears.
- [ ] Highlighted Text button has the selection-ready glow.
- [ ] Click **Highlighted Text**.
- [ ] Capture contains only selected text.
- [ ] Selection note appears in preview and exports.
- [ ] No-selection attempt shows a clear warning.

## Privacy Warnings

- [ ] Logged-in/private page shows a privacy warning.
- [ ] Markdown export includes privacy warning signals when detected.
- [ ] Highlighted Text export from a private page uses private page context wording.
- [ ] Public page with only cookie/privacy footer language does not trigger a false privacy warning.

## Browser Smoke Test

| Browser | Loads | Full Render | Highlighted Text | Icon Visible | Notes |
| --- | --- | --- | --- | --- | --- |
| Chrome | [ ] | [ ] | [ ] | [ ] | |
| Edge | [ ] | [ ] | [ ] | [ ] | |
| Brave | [ ] | [ ] | [ ] | [ ] | |

## Final Sign-Off

- [ ] No console errors during normal operation.
- [ ] No old public-facing pre-rebrand branding remains.
- [ ] README, INSTALL, PRIVACY, LICENSE, CHANGELOG, and RELEASE_NOTES are present.
- [ ] Ready for BrowserBeast v1.0 freeware release.

**Tested by:** _______________  
**Date:** _______________  
**Result:** PASS / FAIL / PASS WITH NOTES
