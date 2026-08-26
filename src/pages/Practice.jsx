import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.jsx';
import { TaskRunner } from '../components/lessons/TaskRunner.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { Button } from '../components/ui/Button.jsx';
import { lessonsById, TRACKS } from '../data/lessons.js';
import { DIFFICULTIES, getTaskById, tasks } from '../data/tasks.js';
import { useProgress } from '../hooks/useProgress.js';
import styles from './Practice.module.css';

const FILTERS = [
  { id: 'all', label: 'Усі задачі' },
  { id: 'unsolved', label: 'Нерозвʼязані' },
  { id: 'solved', label: 'Розвʼязані' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'react', label: 'React' },
];

const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };

export function Practice() {
  const { progress, stats } = useProgress();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');

  const requestedId = searchParams.get('task');
  const activeTask = getTaskById(requestedId) ?? tasks[0];

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const isSolved = Boolean(progress.tasks[task.id]?.solvedAt);
      if (filter === 'solved') return isSolved;
      if (filter === 'unsolved') return !isSolved;
      if (filter === 'javascript' || filter === 'react') {
        return lessonsById[task.lessonId]?.track === filter;
      }
      return true;
    });
  }, [filter, progress.tasks]);

  const selectTask = (taskId) => setSearchParams({ task: taskId });

  return (
    <div className={styles.page}>
      <Breadcrumbs items={[{ label: 'Головна', to: '/' }, { label: 'Практика' }]} />

      <header className={styles.header}>
        <div>
          <h1>Практика</h1>
          <p>
            Усі задачі курсу в одному місці. Розвʼязано {stats.solvedTasks} із {stats.totalTasks} —
            це {stats.taskPercent}% від загального обсягу.
          </p>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.list} aria-label="Список задач">
          <div className={styles.filters} role="group" aria-label="Фільтр задач">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`${styles.filter} ${filter === option.id ? styles.filterActive : ''}`}
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
              >
                {option.label}
              </button>
            ))}
          </div>

          {visibleTasks.length === 0 ? (
            <p className={styles.empty}>Немає задач за цим фільтром.</p>
          ) : (
            <ul className={styles.items}>
              {visibleTasks.map((task) => {
                const lesson = lessonsById[task.lessonId];
                const isSolved = Boolean(progress.tasks[task.id]?.solvedAt);
                const isActive = task.id === activeTask?.id;

                return (
                  <li key={task.id}>
                    <button
                      type="button"
                      className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                      onClick={() => selectTask(task.id)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className={`${styles.dot} ${isSolved ? styles.dotSolved : ''}`}>
                        {isSolved && <Icon name="check" size={11} />}
                      </span>
                      <span className={styles.itemBody}>
                        <span className={styles.itemTitle}>{task.title}</span>
                        <span className={styles.itemMeta}>
                          {TRACKS[lesson.track].label} · {lesson.title}
                        </span>
                      </span>
                      <Tag tone={DIFFICULTY_TONE[task.difficulty]}>
                        {DIFFICULTIES[task.difficulty].label}
                      </Tag>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <div className={styles.runner}>
          {activeTask ? (
            <>
              <div className={styles.runnerHead}>
                <span>
                  З уроку{' '}
                  <Link to={`/lessons/${activeTask.lessonId}`}>
                    {lessonsById[activeTask.lessonId].title}
                  </Link>
                </span>
                <Button
                  as={Link}
                  to={`/lessons/${activeTask.lessonId}`}
                  variant="ghost"
                  size="sm"
                  iconRight={<Icon name="arrowRight" size={15} />}
                >
                  До теорії
                </Button>
              </div>
              <TaskRunner key={activeTask.id} task={activeTask} />
            </>
          ) : (
            <p className={styles.empty}>Обери задачу зі списку.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Practice;
