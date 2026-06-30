# Contributing to BrowserBeast

BrowserBeast is a small, focused tool. Contributions that fit its philosophy are welcome.

## What fits

- Bug fixes
- Reliability improvements
- Privacy signal detection improvements
- Evidence Envelope improvements
- Documentation corrections
- Accessibility improvements in the popup UI

## What doesn't fit

BrowserBeast is intentionally simple. Features that add background processing,
cloud sync, accounts, automatic capture, or parsing logic belong in other tools.
If it makes BrowserBeast larger or more complex without a clear benefit to
capture quality or privacy safety, it probably doesn't fit.

When in doubt, open an issue first and describe the problem you're trying to solve.

## Reporting bugs

Open a GitHub Issue. Include:

- What you were trying to do
- What happened instead
- Your browser name and version
- Whether it was Full Render or Highlighted Text mode

## Suggesting improvements

Open an issue with your idea. Describe the problem, not just the feature.
Small, focused improvements are more likely to land than large redesigns.

## Submitting a pull request

1. Fork the repository.
2. Make your changes.
3. Test by loading the extension as unpacked in Chrome or a Chromium-based browser.
4. Open a PR with a clear description of what changed and why.

Keep PRs small and focused. One thing at a time.

## Code style

BrowserBeast uses vanilla JavaScript with no build step and no external
dependencies. Keep it that way.

- No frameworks, no bundlers, no npm packages.
- Plain ES6+. Chrome Manifest V3.
- Self-contained functions. No new global state.
- Readable over clever.

## License

By contributing, you agree that your contributions will be licensed under
the MIT License.
