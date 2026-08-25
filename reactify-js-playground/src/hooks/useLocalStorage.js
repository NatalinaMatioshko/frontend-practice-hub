import { useCallback, useEffect, useState } from 'react';
import { readStorage, removeStorage, writeStorage } from '../utils/storage.js';

/**
 * State that survives reloads and stays in sync across browser tabs.
 * Returns the familiar [value, setValue] pair plus a reset to the initial value.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  const setStoredValue = useCallback(
    (next) => {
      setValue((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        writeStorage(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setValue(initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== key) return;
      setValue(event.newValue === null ? initialValue : safeParse(event.newValue, initialValue));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  return [value, setStoredValue, reset];
}

function safeParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
