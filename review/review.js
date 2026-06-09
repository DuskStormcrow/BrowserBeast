(() => {
  const titleEl = document.getElementById('reviewTitle');
  const metaEl = document.getElementById('reviewMeta');
  const summaryEl = document.getElementById('reviewSummary');
  const contentEl = document.getElementById('reviewContent');
  const params = new URLSearchParams(window.location.hash.slice(1));
  const key = params.get('key');

  if (!key) {
    contentEl.textContent = 'No BrowserBeast review payload was provided.';
    return;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    contentEl.textContent = 'BrowserBeast review payload is no longer available.';
    return;
  }

  try {
    const payload = JSON.parse(raw);
    const title = payload.title || 'BrowserBeast Full Review';
    const markdown = payload.markdown || '';
    const summary = payload.summary || 'BROWSERBEAST CAPTURE SUMMARY\nArtifact ID: legacy-unassigned';

    document.title = `${title} - BrowserBeast Full Review`;
    titleEl.textContent = title;
    metaEl.textContent = `BrowserBeast v1.0.1 local full review - ${payload.createdAt || ''}`;
    summaryEl.textContent = summary;
    contentEl.textContent = markdown;
  } catch (_) {
    contentEl.textContent = 'BrowserBeast could not read this review payload.';
  } finally {
    localStorage.removeItem(key);
  }
})();
