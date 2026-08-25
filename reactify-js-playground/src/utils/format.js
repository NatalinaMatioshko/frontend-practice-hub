export function formatValue(value, depth = 0) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = typeof value;

  if (type === 'string') return depth === 0 ? `"${value}"` : JSON.stringify(value);
  if (type === 'number') return Object.is(value, -0) ? '-0' : String(value);
  if (type === 'bigint') return `${value}n`;
  if (type === 'boolean') return String(value);
  if (type === 'symbol') return value.toString();
  if (type === 'function') return `[Function: ${value.name || 'anonymous'}]`;

  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof RegExp) return value.toString();

  if (depth > 4) return '…';

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `[${value.map((item) => formatValue(item, depth + 1)).join(', ')}]`;
  }

  if (value instanceof Map) {
    const entries = [...value.entries()].map(
      ([key, val]) => `${formatValue(key, depth + 1)} => ${formatValue(val, depth + 1)}`,
    );
    return `Map(${value.size}) {${entries.length ? ` ${entries.join(', ')} ` : ''}}`;
  }

  if (value instanceof Set) {
    const items = [...value.values()].map((item) => formatValue(item, depth + 1));
    return `Set(${value.size}) {${items.length ? ` ${items.join(', ')} ` : ''}}`;
  }

  const keys = Object.keys(value);
  if (keys.length === 0) return '{}';
  const body = keys.map((key) => `${key}: ${formatValue(value[key], depth + 1)}`).join(', ');
  return `{ ${body} }`;
}

export function formatArgs(args = []) {
  return args.map((arg) => formatValue(arg, 1)).join(', ');
}

export function deepEqual(a, b) {
  if (Object.is(a, b)) return true;

  if (typeof a === 'number' && typeof b === 'number') {
    return Number.isNaN(a) && Number.isNaN(b);
  }

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }

  if (a instanceof Set || b instanceof Set) {
    if (!(a instanceof Set) || !(b instanceof Set) || a.size !== b.size) return false;
    return [...a].every((item) => b.has(item));
  }

  if (a instanceof Map || b instanceof Map) {
    if (!(a instanceof Map) || !(b instanceof Map) || a.size !== b.size) return false;
    return [...a].every(([key, value]) => b.has(key) && deepEqual(value, b.get(key)));
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]),
  );
}
