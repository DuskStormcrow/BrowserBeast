# Security Policy

## Scope

BrowserBeast is a local browser extension. It does not transmit captured content
to external servers, does not use accounts, and does not perform background auto-capture.

Security issues relevant to BrowserBeast include:

- Content injection or XSS in exported Markdown or the Full Review tab
- Privacy signal detection that could be bypassed or spoofed
- localStorage handling vulnerabilities
- Unintended data persistence or leakage
- Content Security Policy gaps in generated output

## Reporting a vulnerability

Please do not open a public GitHub Issue for security vulnerabilities.

Use GitHub's private security advisory feature:

**Repository → Security → Report a vulnerability**

Or send an email to duskstormcrow@gmail.com with the subject line
`BrowserBeast Security`.

Include:

- A description of the issue
- Steps to reproduce it
- Your browser name and version

## What to expect

You will receive an acknowledgement within a few days. Fixes will be
prioritized based on severity. If you would like credit in the release notes,
just say so when you report.

Project home: https://ai-underground.ai/
