import { runTests } from './runnerCore.js';

self.onmessage = (event) => {
  const { id, code, task } = event.data;

  try {
    self.postMessage({ id, payload: runTests(code, task) });
  } catch (error) {
    self.postMessage({
      id,
      payload: {
        status: 'error',
        error: `${error.name}: ${error.message}`,
        logs: [],
        results: [],
      },
    });
  }
};
