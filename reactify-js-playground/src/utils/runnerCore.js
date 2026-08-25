import { deepEqual, formatArgs, formatValue } from './format.js';

// Shadowed as function parameters so learner code cannot reach them through globals.
const BLOCKED_GLOBALS = ['fetch', 'XMLHttpRequest', 'localStorage', 'indexedDB', 'importScripts'];

function createSolutionFactory(code, exportName) {
  const source = [
    '"use strict";',
    code,
    `;return typeof ${exportName} === "undefined" ? undefined : ${exportName};`,
  ].join('\n');

  return new Function('console', ...BLOCKED_GLOBALS, source);
}

function createSandboxConsole(logs) {
  // Top-level strings print bare, like a real console; nested ones stay quoted.
  const write = (...args) =>
    logs.push(args.map((arg) => (typeof arg === 'string' ? arg : formatValue(arg, 1))).join(' '));
  return { log: write, info: write, warn: write, error: write, debug: write };
}

function blockedGlobal(name) {
  return () => {
    throw new Error(`"${name}" is not available inside the playground sandbox`);
  };
}

/**
 * Function arguments cannot cross the worker boundary, so tasks that need them
 * declare `argsSource` — expressions evaluated inside the sandbox instead.
 */
function buildArgs(test) {
  if (!test.argsSource) return { values: (test.args ?? []).map(cloneArg), labels: null };
  const values = new Function(`"use strict";return [${test.argsSource.join(', ')}];`)();
  return { values, labels: test.argsSource.join(', ') };
}

function cloneArg(arg) {
  if (arg === null || typeof arg !== 'object') return arg;
  if (Array.isArray(arg)) return arg.map(cloneArg);
  if (arg instanceof Date) return new Date(arg.getTime());
  if (arg instanceof Map) return new Map([...arg].map(([key, value]) => [key, cloneArg(value)]));
  if (arg instanceof Set) return new Set([...arg].map(cloneArg));
  return Object.fromEntries(Object.entries(arg).map(([key, value]) => [key, cloneArg(value)]));
}

/**
 * Executes learner code against a task's test table.
 * Shared by the sandbox worker and the synchronous fallback runner.
 */
export function runTests(code, task) {
  const { exportName, tests = [] } = task;
  const logs = [];

  let solution;
  try {
    const factory = createSolutionFactory(code, exportName);
    solution = factory(createSandboxConsole(logs), ...BLOCKED_GLOBALS.map(blockedGlobal));
  } catch (error) {
    return {
      status: 'error',
      error: `${error.name}: ${error.message}`,
      logs,
      results: [],
    };
  }

  if (typeof solution !== 'function') {
    return {
      status: 'error',
      error: `Очікується функція з назвою "${exportName}". Знайдено: ${formatValue(solution)}.`,
      logs,
      results: [],
    };
  }

  const results = tests.map((test) => {
    const chain = test.chain ?? [];
    const logsBefore = logs.length;

    let args;
    try {
      args = buildArgs(test);
    } catch (error) {
      return {
        name: test.name ?? exportName,
        call: exportName,
        expected: formatValue(test.expected),
        expectedLogs: null,
        actualLogs: null,
        actual: '—',
        passed: false,
        error: `Некоректний тест: ${error.message}`,
      };
    }

    const call =
      `${exportName}(${args.labels ?? formatArgs(args.values)})` +
      chain.map((chainArgs) => `(${formatArgs(chainArgs)})`).join('');

    const base = {
      name: test.name ?? call,
      call,
      expected: formatValue(test.expected),
      expectedLogs: test.expectedLogs ?? null,
      actualLogs: null,
    };

    let actual;
    try {
      actual = solution(...args.values);

      // Tasks that return a function (closures, currying) declare follow-up calls
      // in `chain`; the returned function is invoked once per entry and the last
      // return value is what gets compared.
      if (chain.length > 0) {
        if (typeof actual !== 'function') {
          throw new TypeError(`Очікувалася функція, а отримано ${formatValue(actual)}`);
        }

        const returned = actual;
        for (const chainArgs of chain) {
          actual = returned(...chainArgs.map(cloneArg));
        }
      }
    } catch (error) {
      return { ...base, actual: '—', passed: false, error: `${error.name}: ${error.message}` };
    }

    const callLogs = logs.slice(logsBefore);
    const valueMatches = deepEqual(actual, test.expected);
    const logsMatch = test.expectedLogs ? deepEqual(callLogs, test.expectedLogs) : true;

    return {
      ...base,
      actual: formatValue(actual),
      actualLogs: test.expectedLogs ? callLogs : null,
      passed: valueMatches && logsMatch,
      error: null,
    };
  });

  return {
    status: results.length > 0 && results.every((result) => result.passed) ? 'passed' : 'failed',
    error: null,
    logs,
    results,
  };
}
