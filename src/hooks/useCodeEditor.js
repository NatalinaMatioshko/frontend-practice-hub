import { useCallback, useEffect, useRef, useState } from 'react';
import { readStorage, writeStorage, STORAGE_KEYS } from '../utils/storage.js';
import { checkTask } from '../utils/taskChecker.js';

const DRAFT_DEBOUNCE = 400;

function readDraft(task) {
  const drafts = readStorage(STORAGE_KEYS.drafts, {});
  return typeof drafts[task.id] === 'string' ? drafts[task.id] : task.starterCode;
}

function saveDraft(taskId, code) {
  const drafts = readStorage(STORAGE_KEYS.drafts, {});
  writeStorage(STORAGE_KEYS.drafts, { ...drafts, [taskId]: code });
}

function clearDraft(taskId) {
  const drafts = readStorage(STORAGE_KEYS.drafts, {});
  const { [taskId]: _removed, ...rest } = drafts;
  writeStorage(STORAGE_KEYS.drafts, rest);
}

/**
 * Owns the editor buffer for a single task: draft persistence, sandboxed runs
 * and the latest check result.
 */
export function useCodeEditor(task, { onResult } = {}) {
  const [code, setCode] = useState(() => readDraft(task));
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loadedTaskId, setLoadedTaskId] = useState(task.id);

  const onResultRef = useRef(onResult);
  const activeTaskIdRef = useRef(task.id);
  const runSeqRef = useRef(0);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    activeTaskIdRef.current = task.id;
  }, [task.id]);

  // Swap the buffer during render when the hook is reused for a different task.
  if (loadedTaskId !== task.id) {
    setLoadedTaskId(task.id);
    setCode(readDraft(task));
    setResult(null);
    setIsRunning(false);
  }

  useEffect(() => {
    const timer = setTimeout(() => saveDraft(task.id, code), DRAFT_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [task.id, code]);

  const run = useCallback(async () => {
    const seq = ++runSeqRef.current;
    setIsRunning(true);

    const outcome = await checkTask(code, task);

    // A newer run, a reset, or a task switch took over while the sandbox was busy.
    if (seq !== runSeqRef.current || activeTaskIdRef.current !== task.id) return outcome;

    setResult(outcome);
    setIsRunning(false);
    onResultRef.current?.(outcome);
    return outcome;
  }, [code, task]);

  const resetCode = useCallback(() => {
    runSeqRef.current += 1;
    clearDraft(task.id);
    setCode(task.starterCode);
    setResult(null);
    setIsRunning(false);
  }, [task]);

  const loadCode = useCallback((nextCode) => {
    setCode(nextCode);
    setResult(null);
  }, []);

  return {
    code,
    setCode,
    result,
    isRunning,
    run,
    resetCode,
    loadCode,
    isDirty: code !== task.starterCode,
  };
}
