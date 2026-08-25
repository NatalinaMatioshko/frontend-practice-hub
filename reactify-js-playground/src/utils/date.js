/**
 * Activity is keyed by the learner's local calendar day.
 * toISOString() would shift the key for any non-UTC timezone, so build it by hand.
 */
export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDay(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });
}

export function formatDateTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
