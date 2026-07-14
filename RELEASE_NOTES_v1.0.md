# BrowserBeast™ v1.0 Final Release Notes

**Chrome Extension · Freeware · Open Source**

BrowserBeast v1.0 is the first public MIT-licensed release of the standalone
BrowserBeast repository. It provides a focused, Markdown-first capture workflow,
a larger local review surface, and Evidence Envelope v0.2.

Project home: https://ai-underground.ai/

## Included

- Full Render and Highlighted Text capture modes.
- **Open Full Review** for reading large captures in a local tab.
- Escaped review output so script-like captured text displays literally.
- Copy Markdown, Download `.md`, and Copy Plain Text.
- Evidence Envelope v0.2 in Markdown exports.
- Artifact-ID-based download filenames.
- Advisory privacy-signal warnings.
- Existing Manifest V3 permissions.
- Local, user-triggered operation with no account or cloud service.
- MIT license and public contribution, conduct, security, and philosophy documents.
- Deterministic, allowlisted release packaging.

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
