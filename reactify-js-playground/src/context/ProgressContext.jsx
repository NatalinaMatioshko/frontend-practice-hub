import { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { STORAGE_KEYS } from '../utils/storage.js';
import { lessons } from '../data/lessons.js';
import { DIFFICULTIES, getTasksForLesson, tasks } from '../data/tasks.js';
import { toDateKey } from '../utils/date.js';

export const ProgressContext = createContext(null);

const EMPTY_PROGRESS = {
  version: 1,
  createdAt: null,
  lessons: {},
  tasks: {},
  activity: {},
};

function normalise(stored) {
  if (!stored || typeof stored !== 'object') return { ...EMPTY_PROGRESS, createdAt: null };
  return {
    ...EMPTY_PROGRESS,
    ...stored,
    lessons: stored.lessons ?? {},
    tasks: stored.tasks ?? {},
    activity: stored.activity ?? {},
  };
}

function touchActivity(activity, field) {
  const key = toDateKey();
  const entry = activity[key] ?? { runs: 0, solved: 0 };
  return { ...activity, [key]: { ...entry, [field]: (entry[field] ?? 0) + 1 } };
}

function countStreak(activity) {
  if (Object.keys(activity).length === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // A streak stays alive if the learner already practised today or last practised yesterday.
  if (!activity[toDateKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
    if (!activity[toDateKey(cursor)]) return 0;
  }

  let streak = 0;
  while (activity[toDateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function ProgressProvider({ children }) {
  const [progress, setProgress, resetStored] = useLocalStorage(
    STORAGE_KEYS.progress,
    EMPTY_PROGRESS,
  );

  const state = useMemo(() => normalise(progress), [progress]);

  const update = useCallback(
    (recipe) => {
      setProgress((current) => {
        const base = normalise(current);
        return {
          ...recipe(base),
          createdAt: base.createdAt ?? new Date().toISOString(),
        };
      });
    },
    [setProgress],
  );

  const markLessonViewed = useCallback(
    (lessonId) => {
      update((base) => {
        if (base.lessons[lessonId]?.viewedAt) return base;
        return {
          ...base,
          lessons: {
            ...base.lessons,
            [lessonId]: { ...base.lessons[lessonId], viewedAt: new Date().toISOString() },
          },
        };
      });
    },
    [update],
  );

  const setLessonCompleted = useCallback(
    (lessonId, completed) => {
      update((base) => ({
        ...base,
        lessons: {
          ...base.lessons,
          [lessonId]: {
            ...base.lessons[lessonId],
            viewedAt: base.lessons[lessonId]?.viewedAt ?? new Date().toISOString(),
            completedAt: completed ? new Date().toISOString() : null,
          },
        },
        activity: completed ? touchActivity(base.activity, 'solved') : base.activity,
      }));
    },
    [update],
  );

  const registerAttempt = useCallback(
    (taskId, passed) => {
      update((base) => {
        const task = base.tasks[taskId] ?? { attempts: 0, solvedAt: null, revealed: false };
        const nextTask = {
          ...task,
          attempts: task.attempts + 1,
          solvedAt: passed ? (task.solvedAt ?? new Date().toISOString()) : task.solvedAt,
        };

        let activity = touchActivity(base.activity, 'runs');
        if (passed && !task.solvedAt) activity = touchActivity(activity, 'solved');

        const nextTasks = { ...base.tasks, [taskId]: nextTask };
        const lessonId = tasks.find((item) => item.id === taskId)?.lessonId;
        const lessonTasks = lessonId ? getTasksForLesson(lessonId) : [];
        const lessonSolved =
          lessonTasks.length > 0 && lessonTasks.every((item) => nextTasks[item.id]?.solvedAt);

        return {
          ...base,
          tasks: nextTasks,
          activity,
          lessons:
            lessonSolved && !base.lessons[lessonId]?.completedAt
              ? {
                  ...base.lessons,
                  [lessonId]: {
                    ...base.lessons[lessonId],
                    viewedAt: base.lessons[lessonId]?.viewedAt ?? new Date().toISOString(),
                    completedAt: new Date().toISOString(),
                  },
                }
              : base.lessons,
        };
      });
    },
    [update],
  );

  const revealSolution = useCallback(
    (taskId) => {
      update((base) => ({
        ...base,
        tasks: {
          ...base.tasks,
          [taskId]: {
            attempts: 0,
            solvedAt: null,
            ...base.tasks[taskId],
            revealed: true,
          },
        },
      }));
    },
    [update],
  );

  const resetProgress = useCallback(() => resetStored(), [resetStored]);

  const stats = useMemo(() => {
    const completedLessons = lessons.filter((lesson) => state.lessons[lesson.id]?.completedAt);
    const viewedLessons = lessons.filter((lesson) => state.lessons[lesson.id]?.viewedAt);
    const solvedTasks = tasks.filter((task) => state.tasks[task.id]?.solvedAt);
    const attempts = Object.values(state.tasks).reduce((sum, task) => sum + (task.attempts ?? 0), 0);
    const points = solvedTasks.reduce((sum, task) => sum + DIFFICULTIES[task.difficulty].points, 0);

    const byTrack = Object.fromEntries(
      ['javascript', 'react'].map((track) => {
        const trackLessons = lessons.filter((lesson) => lesson.track === track);
        const done = trackLessons.filter((lesson) => state.lessons[lesson.id]?.completedAt).length;
        return [track, { total: trackLessons.length, completed: done }];
      }),
    );

    return {
      totalLessons: lessons.length,
      completedLessons: completedLessons.length,
      viewedLessons: viewedLessons.length,
      lessonPercent: lessons.length
        ? Math.round((completedLessons.length / lessons.length) * 100)
        : 0,
      totalTasks: tasks.length,
      solvedTasks: solvedTasks.length,
      taskPercent: tasks.length ? Math.round((solvedTasks.length / tasks.length) * 100) : 0,
      solvedHardTasks: solvedTasks.filter((task) => task.difficulty === 'hard').length,
      attempts,
      points,
      streak: countStreak(state.activity),
      activeDays: Object.keys(state.activity).length,
      byTrack,
      activity: state.activity,
      createdAt: state.createdAt,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      progress: state,
      stats,
      markLessonViewed,
      setLessonCompleted,
      registerAttempt,
      revealSolution,
      resetProgress,
    }),
    [
      state,
      stats,
      markLessonViewed,
      setLessonCompleted,
      registerAttempt,
      revealSolution,
      resetProgress,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
