# BrowserBeast v1.0.1 Hardening Green - 2026-06-09

## Status

BrowserBeast v1.0.1 freeware hardening gates are green.

This repo contains the approved v1.0.1 source update with:

- Artifact-ID generation for browser captures
- Download filenames based on the exact BrowserBeast artifact ID
- Evidence Envelope v0.2 in Markdown exports
- Full Review support for larger local review
- Privacy warning/header behavior preserved

## Verified Gates

Final accepted status:

- Full Render capture: PASS
- Real Chrome local `.md` download: PASS
- Downloaded filename matches artifact ID exactly: PASS
- Highlighted Text capture: PASS
- Highlighted Text local `.md` download: PASS
- Privacy warning/header behavior: PASS
- Evidence Envelope v0.2 present and clean: PASS
- BrowserBeast output opens/readable in review flow: PASS

## Accepted Example Artifacts

Accepted real-download verification examples from the hardening pass:

- `bb-20260609-134408-9vw611.md`
- `bb-20260609-134408-1uqyed.md`

Accepted synthetic private-signal verification examples:

- `bb-20260609-134925-b4bcem.md`
- `bb-20260609-134926-by9y5e.md`

## Scope

BrowserBeast was not changed during the later DesktopBeast package-prep work. This note records the already-accepted BrowserBeast v1.0.1 green state so future work can start from a synchronized repo state.
