/**
 * BrowserBeast v1.0 — Popup Script
 * Two modes: Full Render | Highlighted Text
 * Flow: Capture → Preview → Export (Markdown/Plain Text)
 */

const CAPTURE_MODE_LABELS = {
  full_render: 'Full Render',
  highlighted_text: 'Highlighted Text'
};

const COPY_SUCCESS_MS = 1500;

const $ = id => document.getElementById(id);

// --- DOM references ---
const stageCapture       = $('stageCapture');
const stagePreview       = $('stagePreview');
const btnFullRender      = $('btnFullRender');
const btnHighlightedText = $('btnHighlightedText');
const selectionHint      = $('selectionHint');
const recaptureBtn       = $('recaptureBtn');
const copyMarkdownBtn    = $('copyMarkdownBtn');
const downloadMarkdownBtn = $('downloadMarkdownBtn');
const copyPlainBtn       = $('copyPlainBtn');
const clearBtn           = $('clearBtn');

const previewTitle       = $('previewTitle');
const previewUrl         = $('previewUrl');
const previewTimestamp    = $('previewTimestamp');
const previewMode        = $('previewMode');
const previewPlatform    = $('previewPlatform');
const previewWords       = $('previewWords');
const previewChars       = $('previewChars');
const previewBrowser     = $('previewBrowser');
const previewEngine      = $('previewEngine');
const previewContent     = $('previewContent');

const qualityIndicator   = $('qualityIndicator');
const indicatorLight     = $('indicatorLight');
const indicatorText      = $('indicatorText');
const qualityWarning     = $('qualityWarning');
const selectionNote      = $('selectionNote');
const privateWarning     = $('privateWarning');

const modeTileFullRender = $('modeTileFullRender');
const modeTileHighlighted = $('modeTileHighlighted');

const statusDot          = $('statusDot');
const statusText         = $('statusText');

let captured = null;
let popupSessionPort = null;
let closeSignalSent = false;
const copyFeedbackTimers = new Map();
const copyButtonDefaults = new Map();

// =====================================================================
// Browser & Engine Detection
// =====================================================================
function detectBrowser() {
  const ua = navigator.userAgent || '';
  const chromiumMatch = ua.match(/(?:Chrome|Chromium)\/([\d.]+)/);
  const chromiumVersion = chromiumMatch ? chromiumMatch[1] : '';

  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/([\d.]+)/);
    return match ? `Edge ${match[1]}` : 'Edge';
  }
  if (navigator.brave && typeof navigator.brave.isBrave === 'function') {
    return chromiumVersion ? `Brave (Chromium ${chromiumVersion})` : 'Brave';
  }
  if (ua.includes('Brave')) return chromiumVersion ? `Brave (Chromium ${chromiumVersion})` : 'Brave';
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Vivaldi')) return 'Vivaldi';
  if (ua.includes('Comet')) return 'Comet';
  if (ua.includes('Chrome/')) {
    // Extract version
    const match = ua.match(/Chrome\/([\d.]+)/);
    return match ? `Chrome ${match[1]}` : 'Chrome';
  }
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  return 'Unknown';
}

function detectEngine() {
  const ua = navigator.userAgent || '';
  if (ua.includes('Gecko/') && ua.includes('Firefox')) return 'Gecko';
  if (ua.includes('AppleWebKit/') && !ua.includes('Chrome')) return 'WebKit';
  if (ua.includes('Chrome/') || ua.includes('Edg/') || ua.includes('OPR/')) return 'Blink';
  if (ua.includes('AppleWebKit/')) return 'Blink';
  return 'Unknown';
}

const browserName = detectBrowser();
const engineName = detectEngine();

// =====================================================================
// Init
// =====================================================================
document.addEventListener('DOMContentLoaded', async () => {
  copyButtonDefaults.set(copyMarkdownBtn, copyMarkdownBtn.textContent.trim());
  copyButtonDefaults.set(copyPlainBtn, copyPlainBtn.textContent.trim());

  wireEvents();
  initPopupSessionLifecycle();
  setStatus('Ready to capture', 'ready');
  checkForSelection();
});

// =====================================================================
// Event wiring
// =====================================================================
function wireEvents() {
  btnFullRender.addEventListener('click', () => onCapture('full_render'));
  btnHighlightedText.addEventListener('click', () => onCapture('highlighted_text'));
  recaptureBtn.addEventListener('click', onNewCapture);
  copyMarkdownBtn.addEventListener('click', onCopyMarkdown);
  downloadMarkdownBtn.addEventListener('click', onDownloadMarkdown);
  copyPlainBtn.addEventListener('click', onCopyPlainText);
  clearBtn.addEventListener('click', onClear);
}

// =====================================================================
// Popup session lifecycle
// =====================================================================
function initPopupSessionLifecycle() {
  try {
    popupSessionPort = chrome.runtime.connect({ name: 'popup-session' });
  } catch (err) {
    console.warn('[BrowserBeast/popup] unable to open popup-session port', err);
  }

  window.addEventListener('beforeunload', notifyPopupClosing);
  window.addEventListener('unload', notifyPopupClosing);
}

function notifyPopupClosing() {
  if (closeSignalSent) return;
  closeSignalSent = true;
  try { chrome.runtime.sendMessage({ action: 'popupClosed' }).catch(() => {}); } catch (_) {}
  try { popupSessionPort?.disconnect(); } catch (_) {}
}

// =====================================================================
// Auto-detect selection on popup open
// =====================================================================
async function checkForSelection() {
  try {
    const res = await chrome.runtime.sendMessage({ action: 'checkSelection' });
    if (res && res.success && res.hasSelection) {
      btnHighlightedText.classList.add('has-selection');
      selectionHint.textContent = '✂️ Text selected on page — Highlighted Text ready';
      selectionHint.classList.add('selection-detected');
    } else {
      btnHighlightedText.classList.remove('has-selection');
      selectionHint.textContent = '';
      selectionHint.classList.remove('selection-detected');
    }
  } catch (err) {
    console.warn('[BrowserBeast/popup] selection check failed', err);
  }
}

// =====================================================================
// Capture
// =====================================================================
async function onCapture(mode) {
  const modeLabel = CAPTURE_MODE_LABELS[mode] || mode;

  setStatus(`Capturing (${modeLabel})…`, 'busy');
  btnFullRender.disabled = true;
  btnHighlightedText.disabled = true;

  const activeBtn = (mode === 'highlighted_text') ? btnHighlightedText : btnFullRender;
  activeBtn.classList.add('busy');

  try {
    const res = await chrome.runtime.sendMessage({ action: 'captureContent', mode });

    if (!res || !res.success) {
      throw new Error((res && res.error) || 'Capture failed');
    }

    captured = res.content;
    // Attach browser/engine metadata
    captured.browser = browserName;
    captured.engine = 'BrowserBeast v1.0';
    captured.renderEngine = engineName;

    showPreview();

    const wc = formatNumber(captured.wordCount || 0);
    const cc = formatNumber(captured.characterCount || 0);
    const truncMsg = captured.truncated ? ' (truncated)' : '';
    setStatus(`Captured ${wc} words · ${cc} chars${truncMsg}`, captured.truncated ? 'error' : 'ready');
  } catch (err) {
    console.error('[BrowserBeast/popup] capture error', err);
    setStatus(err.message || 'Capture failed', 'error');
  } finally {
    activeBtn.classList.remove('busy');
    btnFullRender.disabled = false;
    btnHighlightedText.disabled = false;
  }
}

// =====================================================================
// Preview
// =====================================================================
function showPreview() {
  if (!captured) return;

  stageCapture.classList.add('hidden');
  stagePreview.classList.remove('hidden');

  const title = captured.sourceTitle || captured.title || 'Untitled';
  const url = captured.sourceUrl || captured.url || '';
  const timestampIso = captured.capturedAt || new Date().toISOString();
  const timestampText = new Date(timestampIso).toLocaleString();
  const modeLabel = captured.captureModeLabel || CAPTURE_MODE_LABELS[captured.captureMode] || 'Unknown';
  const text = captured.capturedText || '';
  const platform = captured.detectedPlatform || 'Unknown';

  previewTitle.textContent = title;
  previewUrl.textContent = url;
  previewUrl.title = url;
  previewTimestamp.textContent = timestampText;
  previewMode.textContent = modeLabel;
  previewPlatform.textContent = platform;
  previewWords.textContent = formatNumber(captured.wordCount || 0);
  previewChars.textContent = formatNumber(captured.characterCount || 0);
  previewBrowser.textContent = captured.browser || browserName;
  previewEngine.textContent = captured.engine || 'BrowserBeast v1.0';
  previewContent.textContent = text || '[No text captured]';

  // Update mode tiles
  if (captured.captureMode === 'highlighted_text') {
    modeTileFullRender.classList.remove('active');
    modeTileHighlighted.classList.add('active');
  } else {
    modeTileFullRender.classList.add('active');
    modeTileHighlighted.classList.remove('active');
  }

  // Quality indicator
  const quality = captured.quality || { level: 'good', message: '' };
  qualityIndicator.classList.remove('good', 'warn', 'bad');

  if (quality.level === 'fail') {
    qualityIndicator.classList.add('bad');
    indicatorLight.textContent = '✕';
    indicatorText.textContent = 'Empty capture';
  } else if (quality.level === 'warn') {
    qualityIndicator.classList.add('warn');
    indicatorLight.textContent = '!';
    indicatorText.textContent = quality.message || 'Warning';
  } else {
    qualityIndicator.classList.add('good');
    indicatorLight.textContent = '✓';
    const truncNote = captured.truncated ? ' (truncated)' : '';
    indicatorText.textContent = `Capture complete · ${formatNumber(captured.wordCount || 0)} words${truncNote}`;
  }

  // Quality warning
  if (quality.message) {
    qualityWarning.textContent = quality.message;
    qualityWarning.classList.remove('hidden');
  } else {
    qualityWarning.classList.add('hidden');
    qualityWarning.textContent = '';
  }

  // Selection note
  if (captured.isSelection) {
    selectionNote.textContent = 'ℹ️ Selection Capture: Only highlighted text was exported.';
    selectionNote.classList.remove('hidden');
  } else {
    selectionNote.classList.add('hidden');
    selectionNote.textContent = '';
  }

  // Privacy warning
  if (captured.appearsPrivate) {
    const signals = (captured.privateSignals || []).slice(0, 4);
    const pwText = privateWarning.querySelector('.pw-text');
    if (pwText) {
      const signalText = signals.length ? `Signals: ${signals.join(', ')}` : '';
      pwText.querySelector('span').textContent = signalText ? `Review before sharing. ${signalText}` : 'Review before sharing.';
    }
    privateWarning.classList.remove('hidden');
  } else {
    privateWarning.classList.add('hidden');
  }
}

// =====================================================================
// Markdown builder
// =====================================================================
function yamlScalar(value) {
  if (value === null || value === undefined) return 'null';
  return JSON.stringify(String(value));
}

function yamlNumber(value) {
  if (value === null || value === undefined || value === '') return 'null';
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? String(numberValue) : 'null';
}

function yamlArrayField(name, values = []) {
  if (!Array.isArray(values) || values.length === 0) return `  ${name}: []`;
  return [
    `  ${name}:`,
    ...values.map(value => `    - ${yamlScalar(value)}`)
  ].join('\n');
}

function buildEvidenceEnvelopeMarkdown(details) {
  const privacySignals = Array.isArray(details.privacySignals) ? details.privacySignals : [];
  const linkedArtifacts = Array.isArray(details.linkedArtifacts) ? details.linkedArtifacts : [];
  const tags = Array.isArray(details.tags) ? details.tags : [];

  return [
    '```evidence-envelope',
    'evidence_envelope_version: "0.1"',
    '',
    'artifact:',
    `  artifact_id: ${yamlScalar(details.artifactId || '')}`,
    `  artifact_type: ${yamlScalar(details.artifactType || 'browser_capture')}`,
    `  created_at: ${yamlScalar(details.createdAt || '')}`,
    `  created_by_tool: ${yamlScalar(details.createdByTool || 'BrowserBeast')}`,
    `  tool_version: ${yamlScalar(details.toolVersion || '')}`,
    `  capture_status: ${yamlScalar(details.captureStatus || 'unknown')}`,
    '',
    'source:',
    `  source_type: ${yamlScalar(details.sourceType || 'browser')}`,
    `  source_platform: ${yamlScalar(details.sourcePlatform || 'Unknown')}`,
    `  source_url: ${yamlScalar(details.sourceUrl || '')}`,
    `  source_app: ${yamlScalar(details.sourceApp || '')}`,
    `  window_title: ${yamlScalar(details.windowTitle || '')}`,
    `  capture_mode: ${yamlScalar(details.captureMode || '')}`,
    '',
    'content:',
    `  primary_format: ${yamlScalar(details.primaryFormat || 'markdown')}`,
    `  content_path: ${yamlScalar(details.contentPath || '')}`,
    yamlArrayField('companion_files', details.companionFiles || []),
    `  word_count: ${yamlNumber(details.wordCount)}`,
    `  ocr_status: ${yamlScalar(details.ocrStatus || '')}`,
    `  ocr_confidence: ${yamlNumber(details.ocrConfidence)}`,
    '',
    'privacy:',
    `  privacy_scan_status: ${yamlScalar(details.privacyScanStatus || '')}`,
    yamlArrayField('privacy_signals', privacySignals),
    `  redaction_policy: ${yamlScalar(details.redactionPolicy || '')}`,
    '',
    'validation:',
    `  validation_status: ${yamlScalar(details.validationStatus || 'unreviewed')}`,
    `  notes: ${yamlScalar(details.validationNotes || '')}`,
    '',
    'identity:',
    `  associated_identity_id: ${yamlScalar(details.associatedIdentityId || '')}`,
    `  associated_identity_name: ${yamlScalar(details.associatedIdentityName || '')}`,
    `  identity_version: ${yamlScalar(details.identityVersion || '')}`,
    `  host_platform: ${yamlScalar(details.hostPlatform || details.sourcePlatform || '')}`,
    `  host_model: ${yamlScalar(details.hostModel || '')}`,
    `  role_in_artifact: ${yamlScalar(details.roleInArtifact || 'unknown')}`,
    '',
    'links:',
    `  parent_artifact_id: ${yamlScalar(details.parentArtifactId || '')}`,
    yamlArrayField('linked_artifacts', linkedArtifacts),
    `  project: ${yamlScalar(details.project || '')}`,
    yamlArrayField('tags', tags),
    '```'
  ].join('\n');
}

function buildMarkdown() {
  if (!captured) return '';

  const title = captured.sourceTitle || captured.title || 'Untitled Page';
  const url = captured.sourceUrl || captured.url || '';
  const timestampIso = captured.capturedAt || new Date().toISOString();
  const timestampText = new Date(timestampIso).toLocaleString();
  const text = captured.capturedText || '';
  const wordCount = captured.wordCount || (text.match(/\S+/g) || []).length;
  const modeLabel = captured.captureModeLabel || CAPTURE_MODE_LABELS[captured.captureMode] || 'Unknown';
  const platform = captured.detectedPlatform || 'Unknown';
  const captureStatus = captured.truncated ? 'partial' : 'success';
  const privacySignals = captured.appearsPrivate ? (captured.privateSignals || []).slice(0, 4) : [];
  const privacyScanStatus = captured.appearsPrivate ? 'completed' : 'completed';
  const redactionPolicy = captured.appearsPrivate ? 'advisory' : 'none';

  const headerLines = [
    `# ${title}`,
    '',
    `🔗 Source: ${url}`,
    `⏰ Captured: ${timestampText}`,
    `📊 Word Count: ${formatNumber(wordCount)}`,
    `🧭 Capture Mode: ${modeLabel}`,
    `🧩 Platform: ${platform}`,
    `🌐 Browser: ${captured.browser || browserName}`,
    `⚙️ Engine: ${captured.engine || 'BrowserBeast v1.0'}`
  ];

  // Selection note
  if (captured.isSelection) {
    headerLines.push('', 'ℹ️ Selection Capture: Only highlighted text was exported.');
  }

  // Quality warning in markdown
  const quality = captured.quality || {};
  if (quality.message) {
    headerLines.push('', quality.message);
  }

  // Truncation warning
  if (captured.truncated) {
    headerLines.push('', '⚠️ Content was truncated at the character ceiling.');
  }

  // Privacy warning in export
  if (captured.appearsPrivate) {
    const signals = (captured.privateSignals || []).slice(0, 4);
    const signalText = signals.length ? ` Signals: ${signals.join(', ')}.` : '';
    if (captured.isSelection) {
      headerLines.push('', `⛔ Private page context detected.${signalText} Review before sharing. The selected text may be clean, but the source page appeared to be a logged-in/private environment.`);
    } else {
      headerLines.push('', `⛔ Private/logged-in indicators detected.${signalText} Review before sharing.`);
    }
  }

  headerLines.push('', buildEvidenceEnvelopeMarkdown({
    artifactId: captured.captureId || '',
    artifactType: 'browser_capture',
    createdAt: timestampIso,
    createdByTool: 'BrowserBeast',
    toolVersion: captured.engine || 'BrowserBeast v1.0',
    captureStatus,
    sourceType: 'browser',
    sourcePlatform: platform,
    sourceUrl: url,
    sourceApp: captured.browser || browserName,
    windowTitle: title,
    captureMode: modeLabel,
    primaryFormat: 'markdown',
    contentPath: '',
    companionFiles: [],
    wordCount,
    ocrStatus: '',
    ocrConfidence: null,
    privacyScanStatus,
    privacySignals,
    redactionPolicy,
    validationStatus: 'unreviewed',
    validationNotes: '',
    associatedIdentityId: '',
    associatedIdentityName: '',
    identityVersion: '',
    hostPlatform: platform,
    hostModel: '',
    roleInArtifact: 'unknown',
    parentArtifactId: '',
    linkedArtifacts: [],
    project: '',
    tags: []
  }));

  headerLines.push('', '---', '', '## Captured Content', '', text);

  return headerLines.join('\n');
}

// =====================================================================
// Plain Text builder (with metadata header)
// =====================================================================
function buildPlainText() {
  if (!captured) return '';

  const title = captured.sourceTitle || captured.title || 'Untitled Page';
  const url = captured.sourceUrl || captured.url || '';
  const timestampIso = captured.capturedAt || new Date().toISOString();
  const timestampText = new Date(timestampIso).toLocaleString();
  const text = captured.capturedText || '';
  const wordCount = captured.wordCount || (text.match(/\S+/g) || []).length;
  const modeLabel = captured.captureModeLabel || CAPTURE_MODE_LABELS[captured.captureMode] || 'Unknown';
  const platform = captured.detectedPlatform || 'Unknown';

  const lines = [
    `Title: ${title}`,
    `URL: ${url}`,
    `Captured: ${timestampText}`,
    `Mode: ${modeLabel}`,
    `Platform: ${platform}`,
    `Words: ${formatNumber(wordCount)}`,
    `Characters: ${formatNumber(captured.characterCount || 0)}`,
    `Browser: ${captured.browser || browserName}`,
    `Engine: ${captured.engine || 'BrowserBeast v1.0'}`
  ];

  // Warnings
  if (captured.truncated) {
    lines.push('', 'WARNING: Content was truncated at the character ceiling.');
  }

  if (captured.appearsPrivate) {
    const signals = (captured.privateSignals || []).slice(0, 4);
    const signalText = signals.length ? ` Signals: ${signals.join(', ')}.` : '';
    if (captured.isSelection) {
      lines.push('', `WARNING: Private page context detected.${signalText} Review before sharing. The selected text may be clean, but the source page appeared to be a logged-in/private environment.`);
    } else {
      lines.push('', `WARNING: Private/logged-in indicators detected.${signalText} Review before sharing.`);
    }
  }

  if (captured.isSelection) {
    lines.push('', 'Note: Selection Capture — only highlighted text was exported.');
  }

  lines.push('', '─'.repeat(40), '', text);

  return lines.join('\n');
}

// =====================================================================
// Export actions
// =====================================================================
async function onCopyMarkdown() {
  if (!captured) { setStatus('Capture first before copying.', 'error'); return; }
  const markdown = buildMarkdown();
  const copied = await copyText(markdown, 'Markdown copied to clipboard.');
  if (copied) triggerCopySuccessFeedback(copyMarkdownBtn);
}

async function onCopyPlainText() {
  if (!captured) { setStatus('Capture first before copying.', 'error'); return; }
  const plain = buildPlainText();
  const copied = await copyText(plain, 'Plain text copied to clipboard.');
  if (copied) triggerCopySuccessFeedback(copyPlainBtn);
}

function onDownloadMarkdown() {
  if (!captured) { setStatus('Capture first before downloading.', 'error'); return; }

  const markdown = buildMarkdown();
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  const platform = sanitizeSlug(captured.detectedPlatform || 'Unknown');
  const modeSlug = (captured.captureMode === 'highlighted_text') ? 'HighlightedText' : 'FullRender';
  const now = new Date(captured.capturedAt || Date.now());
  const datePart = now.getFullYear()
    + '-' + String(now.getMonth() + 1).padStart(2, '0')
    + '-' + String(now.getDate()).padStart(2, '0');
  const timePart = String(now.getHours()).padStart(2, '0')
    + '-' + String(now.getMinutes()).padStart(2, '0')
    + '-' + String(now.getSeconds()).padStart(2, '0');

  const filename = `BrowserBeast_${platform}_${modeSlug}_${datePart}_${timePart}.md`;

  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);

  setStatus(`Downloaded ${filename}`, 'ready');
}

// =====================================================================
// Clear / New Capture
// =====================================================================
async function onClear() {
  captured = null;
  try { await chrome.runtime.sendMessage({ action: 'clearContent' }); } catch (_) {}
  resetToCaptureState('Capture cleared. Ready for next page.');
}

function onNewCapture() {
  captured = null;
  resetToCaptureState('Ready to capture');
  checkForSelection();
}

function resetToCaptureState(statusMsg) {
  stagePreview.classList.add('hidden');
  stageCapture.classList.remove('hidden');
  previewContent.textContent = 'No content captured yet.';

  qualityWarning.classList.add('hidden');
  qualityWarning.textContent = '';
  selectionNote.classList.add('hidden');
  selectionNote.textContent = '';
  privateWarning.classList.add('hidden');

  for (const [button, label] of copyButtonDefaults.entries()) {
    const timer = copyFeedbackTimers.get(button);
    if (timer) clearTimeout(timer);
    copyFeedbackTimers.delete(button);
    button.classList.remove('copy-feedback-active', 'copy-feedback-pulse');
    button.textContent = label;
  }

  if (statusMsg) setStatus(statusMsg, 'ready');
}

// =====================================================================
// Utility functions
// =====================================================================
async function copyText(text, successMsg) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    setStatus(successMsg, 'ready');
    return true;
  } catch (err) {
    console.error('[BrowserBeast/popup] copy failed', err);
    try {
      fallbackCopy(text);
      setStatus(successMsg, 'ready');
      return true;
    } catch (fallbackErr) {
      setStatus('Copy failed: ' + fallbackErr.message, 'error');
      return false;
    }
  }
}

function fallbackCopy(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.setAttribute('readonly', 'readonly');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  temp.remove();
}

function triggerCopySuccessFeedback(button) {
  if (!button) return;
  const defaultLabel = copyButtonDefaults.get(button) || button.textContent.trim();
  const activeTimer = copyFeedbackTimers.get(button);
  if (activeTimer) clearTimeout(activeTimer);

  button.classList.remove('copy-feedback-active', 'copy-feedback-pulse');
  void button.offsetWidth;
  button.classList.add('copy-feedback-pulse', 'copy-feedback-active');
  button.textContent = '✓ Copied!';

  const timer = setTimeout(() => {
    button.classList.remove('copy-feedback-active', 'copy-feedback-pulse');
    button.textContent = defaultLabel;
    copyFeedbackTimers.delete(button);
  }, COPY_SUCCESS_MS);

  copyFeedbackTimers.set(button, timer);
}

function sanitizeSlug(value) {
  return (value || 'Unknown')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .slice(0, 32) || 'Unknown';
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function setStatus(text, kind = 'ready') {
  statusText.textContent = text;
  statusDot.classList.remove('busy', 'error');
  if (kind === 'busy') statusDot.classList.add('busy');
  if (kind === 'error') statusDot.classList.add('error');
}

console.log('[BrowserBeast/popup] v1.0.0 ready');
