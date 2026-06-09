/**
 * BrowserBeast v1.0.1 — Background Service Worker
 * ----------------------------------------------------------------------
 * Two capture modes only:
 *   1. Full Render   — full rendered page text, minimal junk stripping
 *   2. Highlighted Text — user-selected text only
 *
 * No injection, no platform tab scanning, no send-to-platform.
 * Pure capture → export.
 *
 * Stormcrow / AI Underground
 * ----------------------------------------------------------------------
 */

// ---------------------------------------------------------------------
// Platform registry — for metadata/filename only (no injection)
// ---------------------------------------------------------------------
const PLATFORM_DETECT = [
  { id: 'ChatGPT', matches: ['chatgpt.com', 'chat.openai.com'] },
  { id: 'Claude',  matches: ['claude.ai'] },
  { id: 'Gemini',  matches: ['gemini.google.com'] },
  { id: 'ChatLLM', matches: ['apps.abacus.ai', 'chatllm.abacus.ai'] },
  { id: 'Grok',    matches: ['grok.com', 'x.ai', 'x.com'] },
  { id: 'Copilot', matches: ['copilot.microsoft.com', 'm365.cloud.microsoft'] },
  { id: 'Perplexity.ai', matches: ['perplexity.ai'] },
  { id: '1min.AI', matches: ['app.1min.ai'] },
  { id: 'Lumo', matches: ['lumo.proton.me'] },
  { id: 'NHL.com', matches: ['nhl.com'] },
  { id: 'MSN', matches: ['msn.com'] }
];

const CAPTURE_MODE_LABELS = {
  full_render: 'Full Render',
  highlighted_text: 'Highlighted Text'
};

function generateArtifactId(date = new Date()) {
  const pad = value => String(value).padStart(2, '0');
  const datePart =
    String(date.getFullYear())
    + pad(date.getMonth() + 1)
    + pad(date.getDate());
  const timePart =
    pad(date.getHours())
    + pad(date.getMinutes())
    + pad(date.getSeconds());
  const suffix = Math.random().toString(36).replace(/[^a-z0-9]/g, '').slice(2, 8).padEnd(6, '0');
  return `bb-${datePart}-${timePart}-${suffix}`;
}

function detectPlatformFromUrl(url = '') {
  for (const p of PLATFORM_DETECT) {
    if (p.matches.some(m => url.includes(m))) return p.id;
  }
  return 'Unknown';
}

// ---------------------------------------------------------------------
// State — scoped to popup session
// ---------------------------------------------------------------------
let capturedContent = null;

function clearCapturedContent(reason = 'unspecified') {
  capturedContent = null;
  console.log('[BrowserBeast/bg] cleared captured content:', reason);
}

// ---------------------------------------------------------------------
// Popup session lifecycle
// ---------------------------------------------------------------------
chrome.runtime.onConnect.addListener(port => {
  if (!port || port.name !== 'popup-session') return;
  clearCapturedContent('new popup session opened');

  port.onDisconnect.addListener(() => {
    clearCapturedContent('popup session disconnected');
  });
});

// ---------------------------------------------------------------------
// Message router
// ---------------------------------------------------------------------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('[BrowserBeast/bg]', msg && msg.action);
  switch (msg && msg.action) {
    case 'captureContent':
      handleCapture(msg, sendResponse);
      return true;

    case 'checkSelection':
      handleCheckSelection(sendResponse);
      return true;

    case 'getStatus':
      sendResponse({ success: true, hasContent: !!capturedContent, content: capturedContent });
      return false;

    case 'clearContent':
      clearCapturedContent('clearContent action');
      sendResponse({ success: true });
      return false;

    case 'popupClosed':
      clearCapturedContent('popupClosed action');
      sendResponse({ success: true });
      return false;

    default:
      sendResponse({ success: false, error: 'Unknown action: ' + (msg && msg.action) });
      return false;
  }
});

// ---------------------------------------------------------------------
// Check if there's selected text on the active tab
// ---------------------------------------------------------------------
async function handleCheckSelection(sendResponse) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      sendResponse({ success: true, hasSelection: false });
      return;
    }

    const url = tab.url || '';
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) {
      sendResponse({ success: true, hasSelection: false });
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const sel = window.getSelection();
        const text = sel ? sel.toString().trim() : '';
        return { hasSelection: text.length > 0, selectionLength: text.length };
      }
    });

    if (results && results[0] && results[0].result) {
      sendResponse({ success: true, ...results[0].result });
    } else {
      sendResponse({ success: true, hasSelection: false });
    }
  } catch (err) {
    console.warn('[BrowserBeast/bg] checkSelection failed:', err.message);
    sendResponse({ success: true, hasSelection: false });
  }
}

// ---------------------------------------------------------------------
// Capture: snapshot the active tab's content using selected mode.
// ---------------------------------------------------------------------
async function handleCapture(msg, sendResponse) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      sendResponse({ success: false, error: 'No active tab found.' });
      return;
    }

    const url = tab.url || '';
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:')) {
      sendResponse({ success: false, error: 'Cannot capture browser-internal pages.' });
      return;
    }

    const mode = (msg.mode === 'highlighted_text') ? 'highlighted_text' : 'full_render';

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: capturePageContent,
      args: [{ mode }]
    });

    if (!results || !results[0] || !results[0].result) {
      sendResponse({ success: false, error: 'Capture script returned no result.' });
      return;
    }

    const captureResult = results[0].result;
    if (captureResult.error) {
      sendResponse({ success: false, error: captureResult.error });
      return;
    }

    // Detect platform from URL
    const platform = detectPlatformFromUrl(tab.url || '');
    const capturedAtDate = new Date();
    const capturedAt = capturedAtDate.toISOString();
    const artifactId = generateArtifactId(capturedAtDate);

    capturedContent = {
      ...captureResult,
      artifactId,
      captureId: artifactId,
      sourceUrl: tab.url,
      sourceTitle: tab.title,
      capturedAt,
      captureMode: mode,
      captureModeLabel: CAPTURE_MODE_LABELS[mode] || mode,
      captureScope: mode === 'highlighted_text' ? 'selection' : 'full_render',
      selectionMode: mode === 'highlighted_text' ? 'highlighted_text' : '',
      detectedPlatform: platform
    };

    console.log('[BrowserBeast/bg] captured', {
      artifactId: capturedContent.artifactId,
      url: capturedContent.sourceUrl,
      mode: capturedContent.captureMode,
      platform: capturedContent.detectedPlatform,
      words: capturedContent.wordCount
    });

    sendResponse({ success: true, content: capturedContent });
  } catch (err) {
    console.error('[BrowserBeast/bg] capture failed', err);
    sendResponse({ success: false, error: err.message });
  }
}

// ---------------------------------------------------------------------
// Capture function — runs in page context via executeScript.
// MUST be self-contained (no closures over background scope).
// ---------------------------------------------------------------------
function capturePageContent({ mode = 'full_render' } = {}) {
  // --- Utility functions (self-contained) ---

  const collapseBlankLines = (text = '', max = 2) =>
    text.replace(new RegExp(`\n{${max + 1},}`, 'g'), '\n'.repeat(max));

  const normalizeInlineWhitespace = (text = '') => (
    text
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/([.!?])([A-Z])/g, '$1 $2')
      .replace(/([.!?][\""'')\]])([A-Z])/g, '$1 $2')
      .trim()
  );

  const countWords = (text = '') => (text.match(/\S+/g) || []).length;

  const getTextFromNode = (node) => {
    if (!node) return '';
    const inner = typeof node.innerText === 'string' ? node.innerText : '';
    const content = typeof node.textContent === 'string' ? node.textContent : '';
    const raw = (inner || content || '').replace(/\r\n?/g, '\n').trim();
    return collapseBlankLines(raw, 3);
  };

  // --- Junk strings to strip (universal utility strings only) ---
  const JUNK_PATTERNS = [
    /^skip to (main )?content$/i,
    /^skip to navigation$/i,
    /^skip navigation$/i,
    /^back to top$/i
  ];

  const stripJunkLines = (text = '') => {
    const lines = text.split('\n');
    const cleaned = lines.filter(line => {
      const trimmed = line.trim();
      if (!trimmed) return true; // preserve blank lines
      return !JUNK_PATTERNS.some(p => p.test(trimmed));
    });
    return cleaned.join('\n');
  };

  // --- Platform detection (runs in page context) ---
  const PLATFORMS = [
    { id: 'ChatGPT', matches: ['chatgpt.com', 'chat.openai.com'] },
    { id: 'Claude',  matches: ['claude.ai'] },
    { id: 'Gemini',  matches: ['gemini.google.com'] },
    { id: 'ChatLLM', matches: ['apps.abacus.ai', 'chatllm.abacus.ai'] },
    { id: 'Grok',    matches: ['grok.com', 'x.ai', 'x.com'] },
    { id: 'Copilot', matches: ['copilot.microsoft.com', 'm365.cloud.microsoft'] },
    { id: 'Perplexity.ai', matches: ['perplexity.ai'] },
    { id: '1min.AI', matches: ['app.1min.ai'] },
    { id: 'Lumo', matches: ['lumo.proton.me'] },
    { id: 'NHL.com', matches: ['nhl.com'] },
    { id: 'MSN', matches: ['msn.com'] }
  ];

  const pageUrl = location.href || '';
  let detectedPlatform = 'Unknown';
  for (const p of PLATFORMS) {
    if (p.matches.some(m => pageUrl.includes(m))) {
      detectedPlatform = p.id;
      break;
    }
  }

  // --- Privacy signal detection ---
  const detectPrivateSignals = () => {
    const pageText = (document.body?.innerText || document.body?.textContent || '').toLowerCase();

    // Real private indicators — terms that strongly imply a logged-in session
    const strongPatterns = [
      'sign out', 'log out', 'logout', 'my account', 'profile',
      'workspace', 'dashboard', 'billing', 'account', 'inbox'
    ];

    // Generic public patterns to exclude — these appear on public pages
    const publicExclusions = [
      'cookie settings', 'privacy settings', 'notification settings',
      'cookie preferences', 'manage preferences', 'consent settings'
    ];

    const textSignals = strongPatterns.filter(p => {
      if (!pageText.includes(p)) return false;
      // "settings" alone is too noisy — only count if NOT preceded by cookie/privacy/etc.
      if (p === 'settings') {
        // Check if every occurrence is a generic public setting
        const settingsRegex = /(?:cookie|privacy|notification|consent|manage)\s+settings/gi;
        const genericCount = (pageText.match(settingsRegex) || []).length;
        const totalCount = (pageText.match(/\bsettings\b/gi) || []).length;
        return totalCount > genericCount;  // Only flag if there are non-generic "settings"
      }
      return true;
    }).slice(0, 8);

    const selectorSignals = [];

    const selectorChecks = [
      ['[aria-label*="profile" i]', 'profile aria-label'],
      ['[data-testid*="profile" i]', 'profile test-id'],
      ['img[alt*="avatar" i]', 'avatar image'],
      ['[class*="avatar" i]', 'avatar class'],
      ['a[href*="/account" i], a[href*="/dashboard" i]', 'account/dashboard link'],
      ['[data-testid*="avatar" i]', 'avatar test-id']
    ];

    for (const [selector, label] of selectorChecks) {
      if (document.querySelector(selector)) {
        selectorSignals.push(label);
      }
    }

    // Check for sign-out buttons specifically (strong signal)
    const controls = Array.from(document.querySelectorAll('button, a')).slice(0, 500);
    const hasSignoutControl = controls.some(el => {
      const text = (el.innerText || el.textContent || '').trim();
      return /sign\s*out|log\s*out|logout/i.test(text);
    });
    if (hasSignoutControl) selectorSignals.push('sign-out button/link');

    const allSignals = [...textSignals, ...selectorSignals];
    return {
      appearsPrivate: allSignals.length > 0,
      privateSignals: Array.from(new Set(allSignals)).slice(0, 8)
    };
  };

  // --- Title and metadata ---
  const title = document.title || '';
  const description =
    document.querySelector('meta[name="description"]')?.content ||
    document.querySelector('meta[property="og:description"]')?.content || '';

  // =================================================================
  // MODE: Full Render
  // =================================================================
  if (mode === 'full_render') {
    const rawText = getTextFromNode(document.body);
    const cleanedText = stripJunkLines(rawText);
    const normalizedText = collapseBlankLines(cleanedText.replace(/\r\n?/g, '\n').trim(), 3);

    // Hard cap: 150,000 characters
    const HARD_CAP = 150000;
    const truncated = normalizedText.length > HARD_CAP;
    const capturedText = normalizedText.slice(0, HARD_CAP);
    const wordCount = countWords(capturedText);

    // Quality assessment
    let qualityLevel = 'good';
    let qualityMessage = '';

    if (wordCount === 0) {
      qualityLevel = 'fail';
      qualityMessage = '⚠️ Empty Capture: No text content was captured from this page.';
    } else if (wordCount < 50) {
      qualityLevel = 'warn';
      qualityMessage = '⚠️ Low Content: Full Render captured fewer than 50 words. The page may still be loading or may have minimal text content. If the page body is visible, try Highlighted Text mode.';
    }

    const privacy = detectPrivateSignals();

    return {
      title,
      description,
      capturedText,
      wordCount,
      characterCount: capturedText.length,
      truncated,
      detectedPlatform,
      quality: { level: qualityLevel, message: qualityMessage },
      appearsPrivate: privacy.appearsPrivate,
      privateSignals: privacy.privateSignals
    };
  }

  // =================================================================
  // MODE: Highlighted Text
  // =================================================================
  if (mode === 'highlighted_text') {
    const selection = window.getSelection();
    const rawText = selection ? selection.toString() : '';
    const text = normalizeInlineWhitespace(rawText);

    if (!text) {
      return {
        error: '⚠️ Empty Selection: No highlighted text was detected. Please select text on the page before capturing.'
      };
    }

    const wordCount = countWords(text);

    // Hard cap: 150,000 characters
    const HARD_CAP = 150000;
    const truncated = text.length > HARD_CAP;
    const capturedText = text.slice(0, HARD_CAP);

    // Quality assessment
    let qualityLevel = 'good';
    let qualityMessage = '';

    if (wordCount < 5) {
      qualityLevel = 'warn';
      qualityMessage = '⚠️ Short Selection: This capture contains very little text.';
    }

    const privacy = detectPrivateSignals();

    return {
      title,
      description,
      capturedText,
      wordCount: countWords(capturedText),
      characterCount: capturedText.length,
      truncated,
      detectedPlatform,
      quality: { level: qualityLevel, message: qualityMessage },
      appearsPrivate: privacy.appearsPrivate,
      privateSignals: privacy.privateSignals,
      isSelection: true
    };
  }

  // Fallback (should never reach here)
  return { error: 'Unknown capture mode: ' + mode };
}

// ---------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------
clearCapturedContent('service worker startup');
console.log('[BrowserBeast/bg] service worker initialized — v1.0.1');
