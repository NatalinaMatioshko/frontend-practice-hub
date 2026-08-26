import { useEffect, useMemo } from 'react';
import { getAdjacentLessons, getLessonById } from '../data/lessons.js';
import { getTasksForLesson } from '../data/tasks.js';
import { useProgress } from './useProgress.js';

/**
 * Resolves everything a lesson screen needs and records the visit once.
 */
export function useLesson(lessonId) {
  const { progress, markLessonViewed, setLessonCompleted } = useProgress();

  const lesson = useMemo(() => getLessonById(lessonId), [lessonId]);
  const lessonTasks = useMemo(() => (lesson ? getTasksForLesson(lesson.id) : []), [lesson]);
  const adjacent = useMemo(() => getAdjacentLessons(lessonId), [lessonId]);

  useEffect(() => {
    if (lesson) markLessonViewed(lesson.id);
  }, [lesson, markLessonViewed]);

  const solvedTaskIds = useMemo(
    () => lessonTasks.filter((task) => progress.tasks[task.id]?.solvedAt).map((task) => task.id),
    [lessonTasks, progress.tasks],
  );

  return {
    lesson,
    tasks: lessonTasks,
    ...adjacent,
    solvedTaskIds,
    solvedCount: solvedTaskIds.length,
    isCompleted: Boolean(lesson && progress.lessons[lesson.id]?.completedAt),
    toggleCompleted: () =>
      lesson && setLessonCompleted(lesson.id, !progress.lessons[lesson.id]?.completedAt),
  };
}
