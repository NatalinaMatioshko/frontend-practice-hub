import { runTests } from './runnerCore.js';
import { validateCode } from './codeValidator.js';

const DEFAULT_TIMEOUT = 2500;

let nextRunId = 0;

function createWorker() {
  if (typeof Worker === 'undefined') return null;
  try {
    return new Worker(new URL('./sandbox.worker.js', import.meta.url), { type: 'module' });
  } catch {
    return null;
  }
}

/**
 * Runs learner code in a worker so that infinite loops can be terminated,
 * falling back to synchronous execution where workers are unavailable.
 */
function executeInWorker(code, task, timeout) {
  const worker = createWorker();
  if (!worker) return Promise.resolve(runTests(code, task));

  const id = ++nextRunId;

  return new Promise((resolve) => {
    const finish = (payload) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(payload);
    };

    const timer = setTimeout(() => {
      finish({
        status: 'timeout',
        error: `Виконання перевищило ${timeout} мс — імовірно, у коді нескінченний цикл.`,
        logs: [],
        results: [],
      });
    }, timeout);

    worker.onmessage = (event) => {
      if (event.data?.id === id) finish(event.data.payload);
    };

    worker.onerror = (event) => {
      finish({
        status: 'error',
        error: event.message || 'Не вдалося виконати код у пісочниці.',
        logs: [],
        results: [],
      });
    };

    worker.postMessage({ id, code, task: serialiseTask(task) });
  });
}

function serialiseTask(task) {
  return {
    exportName: task.exportName,
    tests: (task.tests ?? []).map(({ name, args, argsSource, chain, expected, expectedLogs }) => ({
      name,
      args,
      argsSource,
      chain,
      expected,
      expectedLogs,
    })),
  };
}

export async function checkTask(code, task, { timeout = DEFAULT_TIMEOUT } = {}) {
  const validation = validateCode(code, task.rules);

  if (!validation.valid) {
    return {
      status: 'invalid',
      error: validation.issues[0],
      issues: validation.issues,
      logs: [],
      results: [],
      passedCount: 0,
      totalCount: task.tests?.length ?? 0,
    };
  }

  const outcome = await executeInWorker(code, task, timeout);
  const results = outcome.results ?? [];

  return {
    ...outcome,
    issues: [],
    passedCount: results.filter((result) => result.passed).length,
    totalCount: results.length || (task.tests?.length ?? 0),
  };
}
