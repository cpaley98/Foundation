// Local-first persistence for Foundation

const STORAGE_KEY = 'foundation_items_v1';

export function loadItems(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('[Foundation] Could not persist to localStorage:', e);
  }
}

export function clearItems() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
