# BrowserBeast™ v1.0 Release Notes

**Chrome Extension · Freeware · Open Source**

BrowserBeast v1.0 is the first public MIT-licensed release of the standalone
BrowserBeast repository. It preserves the focused Markdown-first capture workflow
and adds a larger local review surface plus Evidence Envelope v0.2.

Project home: https://ai-underground.ai/

## Added

- **Open Full Review** for reading large captures in a local tab.
- Escaped review output so script-like captured text displays literally.
- Evidence Envelope v0.2 in Markdown exports.
- Artifact-ID-based download filenames.
- MIT license, contribution guidance, security policy, code of conduct, and
  project philosophy.
- Deterministic, allowlisted release packaging.

## Preserved

- Full Render and Highlighted Text capture modes.
- Copy Markdown, Download `.md`, and Copy Plain Text.
- Advisory privacy-signal warnings.
- Existing Manifest V3 permissions.
- Local, user-triggered operation with no account or cloud service.

## Not included

- Automatic or background capture.
- Cloud sync or accounts.
- PNG screenshot capture or stitching.
- Automatic redaction.
- PersonaVault or Chronicle Engine runtime behavior.

## Verification

The source contains no compilation step or third-party dependencies. Run
`python scripts/package_release.py` from a clean clone, then complete
`SIDELOAD_TEST_CHECKLIST.md` against the generated ZIP.
