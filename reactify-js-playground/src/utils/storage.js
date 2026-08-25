const PREFIX = 'reactify:';

export const STORAGE_KEYS = {
  progress: `${PREFIX}progress`,
  theme: `${PREFIX}theme`,
  drafts: `${PREFIX}drafts`,
};

function getStore() {
  try {
    const probe = `${PREFIX}__probe__`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

const store = typeof window === 'undefined' ? null : getStore();

export function readStorage(key, fallback) {
  if (!store) return fallback;
  try {
    const raw = store.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  if (!store) return false;
  try {
    store.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    /* storage unavailable — nothing to clean up */
  }
}

export const isStorageAvailable = store !== null;
