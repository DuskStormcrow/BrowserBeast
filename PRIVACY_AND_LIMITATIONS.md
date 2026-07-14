# BrowserBeast™ v1.0.1 Privacy And Limitations

## Privacy Posture

BrowserBeast™ is a user-triggered capture/export tool.

BrowserBeast™ does not require an account, does not use a cloud service, and does
not intentionally transmit captured page content to AI Underground or any external
server as part of its normal workflow.

Capture runs when the user chooses to capture the current page or highlighted
text.

## Permissions

BrowserBeast™ v1.0.1 requests:

```json
"permissions": [
  "activeTab",
  "scripting"
],
"host_permissions": [
  "<all_urls>"
]
```

These permissions allow BrowserBeast to capture the page the user chooses. The
extension is not designed to silently monitor pages in the background.

## What May Be Captured

Depending on capture mode and page content, BrowserBeast may capture:

- Rendered page text.
- User-highlighted text.
- Page title.
- Source URL.
- Capture timestamp.
- Word count.
- Capture mode.
- Captured Markdown shown in a local Full Review tab when the user chooses that
  action.
- Browser and tool metadata.
- Detected platform name.
- Private/logged-in advisory signals.

## Review Before Sharing

BrowserBeast™ can capture private, logged-in, account, workspace, chat, dashboard,
or internal-tool content if the user chooses to capture that page.

Review captures before sharing. BrowserBeast™ may preserve private/logged-in
indicators or page content visible at capture time.

Private-page warnings are advisory only. Users are responsible for reviewing
exports before sharing, publishing, uploading, emailing, or sending them to an AI
system.

## Limitations

- Browser-internal pages such as `chrome://`, `edge://`, and `about:` cannot be
  captured.
- Very long captures are capped at 150,000 characters.
- Browser-native PDF viewers may not expose readable text.
- iframe content and third-party embedded widgets may not be captured.
- Dynamic pages may need to finish loading before capture.
- Noisy web pages may include menus, navigation, banners, or unrelated text.
- Privacy warnings are advisory and may miss sensitive content.
- BrowserBeast™ v1.0.1 does not capture PNG visual companions.

## Evidence Envelope

Evidence Envelope v0.2 records privacy signals in structured metadata, but it
does not redact content automatically and does not certify that a capture is safe
to share.

Project home: https://ai-underground.ai/
