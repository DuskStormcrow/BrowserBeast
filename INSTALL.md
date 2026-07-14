# Install BrowserBeast™ v1.0

BrowserBeast™ is a free, open-source Chrome extension. It uses vanilla JavaScript
and requires no dependency installation or compilation.

Project home: https://ai-underground.ai/

## Install the release ZIP in Chrome

1. Download `BrowserBeast-v1.0.zip` from the official release.
2. Unzip it into a clean folder.
3. Open `chrome://extensions`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted `BrowserBeast-v1.0` folder containing `manifest.json`.
7. Confirm BrowserBeast loads without errors.
8. Pin it to the toolbar if desired.

## Install from a clean clone

```sh
git clone https://github.com/DuskStormcrow/BrowserBeast.git
cd BrowserBeast
```

Load the repository root with Chrome's **Load unpacked** action. No build command
is required.

## Create the release ZIP

Python 3.9 or newer is recommended for the release-packaging helper.

```sh
python scripts/package_release.py
```

The script packages only the files listed in `RELEASE_FILES.txt` and writes
`dist/BrowserBeast-v1.0.zip`.

## First test

1. Open a normal webpage.
2. Click the BrowserBeast toolbar icon.
3. Choose **Full Render**.
4. Confirm the preview appears.
5. Test **Open Full Review**, **Copy Markdown**, and **Download .md**.
6. Select text on a page and verify **Highlighted Text** captures only that text.

Complete [SIDELOAD_TEST_CHECKLIST.md](SIDELOAD_TEST_CHECKLIST.md) before publishing
a release package.

## Chromium browsers

Edge, Brave, Opera, and Vivaldi have similar extension-loading screens, but Chrome
is the primary verified browser for v1.0. In Edge, start at `edge://extensions`.

## Browser restrictions

BrowserBeast cannot capture browser-internal pages such as `chrome://extensions`,
`edge://settings`, or `about:blank`.

Chrome may warn that BrowserBeast can read and change data on websites. Broad host
access allows the extension to capture the page the user chooses. Capture runs
only after the user clicks a BrowserBeast capture action.

Review every capture before sharing it. BrowserBeast may preserve private,
logged-in, or otherwise sensitive content visible at capture time.
