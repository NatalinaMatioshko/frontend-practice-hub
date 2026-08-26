import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.jsx';
import { ProgressTracker } from '../components/progress/ProgressTracker.jsx';
import { StatsDashboard } from '../components/progress/StatsDashboard.jsx';
import { AchievementBadge } from '../components/progress/AchievementBadge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { evaluateAchievements } from '../data/achievements.js';
import { orderedLessons, TRACKS } from '../data/lessons.js';
import { getTasksForLesson } from '../data/tasks.js';
import { useProgress } from '../hooks/useProgress.js';
import { formatDateTime } from '../utils/date.js';
import { isStorageAvailable } from '../utils/storage.js';
import styles from './Progress.module.css';

export function Progress() {
  const { progress, stats, resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const badges = evaluateAchievements(stats);
  const earned = badges.filter((badge) => badge.earned).length;

  return (
    <div className={styles.page}>
      <Breadcrumbs items={[{ label: 'Головна', to: '/' }, { label: 'Прогрес' }]} />

      <header className={styles.header}>
        <div>
          <h1>Твій прогрес</h1>
          <p>
            {stats.createdAt
              ? `Навчання розпочато ${formatDateTime(stats.createdAt)}.`
              : 'Прогрес зʼявиться після першого відкритого уроку.'}{' '}
            Дані зберігаються лише у цьому браузері.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          iconLeft={<Icon name="reset" size={15} />}
          onClick={() => setConfirmReset(true)}
        >
          Скинути прогрес
        </Button>
      </header>

      {!isStorageAvailable && (
        <p className={styles.warning}>
          Локальне сховище недоступне у цьому браузері — прогрес не збережеться після перезавантаження.
        </p>
      )}

      <ProgressTracker />

      <StatsDashboard />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Досягнення</h2>
          <Tag tone="brand">
            {earned} з {badges.length}
          </Tag>
        </div>
        <div className={styles.badges}>
          {badges.map((badge) => (
            <AchievementBadge key={badge.id} achievement={badge} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Уроки</h2>
        <Card padding="none">
          <ul className={styles.lessons}>
            {orderedLessons.map((lesson) => {
              const state = progress.lessons[lesson.id];
              const lessonTasks = getTasksForLesson(lesson.id);
              const solved = lessonTasks.filter((task) => progress.tasks[task.id]?.solvedAt).length;

              return (
                <li key={lesson.id} className={styles.lessonRow}>
                  <span className={`${styles.status} ${state?.completedAt ? styles.done : ''}`}>
                    {state?.completedAt ? <Icon name="check" size={13} /> : lesson.order}
                  </span>

                  <div className={styles.lessonBody}>
                    <Link to={`/lessons/${lesson.id}`} className={styles.lessonTitle}>
                      {lesson.title}
                    </Link>
                    <span className={styles.lessonMeta}>
                      {TRACKS[lesson.track].label} · задач: {solved}/{lessonTasks.length}
                    </span>
                  </div>

                  <span className={styles.lessonState}>
                    {state?.completedAt
                      ? 'Завершено'
                      : state?.viewedAt
                        ? 'Розпочато'
                        : 'Не розпочато'}
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Скинути весь прогрес?"
        description="Дію не можна скасувати."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>
              Скасувати
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
            >
              Так, скинути
            </Button>
          </>
        }
      >
        <p className={styles.modalText}>
          Буде видалено відмітки про завершені уроки, розвʼязані задачі, бали та історію активності.
          Написаний у редакторі код залишиться на місці.
        </p>
      </Modal>
    </div>
  );
}

export default Progress;
