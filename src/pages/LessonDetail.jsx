import { Link, Navigate, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.jsx';
import { LessonViewer } from '../components/lessons/LessonViewer.jsx';
import { TaskRunner } from '../components/lessons/TaskRunner.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { ProgressBar } from '../components/ui/ProgressBar.jsx';
import { LEVELS, TRACKS } from '../data/lessons.js';
import { useLesson } from '../hooks/useLesson.js';
import styles from './LessonDetail.module.css';

export function LessonDetail() {
  const { lessonId } = useParams();
  const { lesson, tasks, previous, next, solvedCount, isCompleted, toggleCompleted } =
    useLesson(lessonId);

  if (!lesson) return <Navigate to="/lessons" replace />;

  const track = TRACKS[lesson.track];
  const level = LEVELS[lesson.level];

  return (
    <article className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Головна', to: '/' },
          { label: 'Уроки', to: '/lessons' },
          { label: lesson.title },
        ]}
      />

      <header className={styles.header}>
        <div className={styles.tags}>
          <Tag tone={track.color} icon={<Icon name={track.icon} size={14} />}>
            {track.label}
          </Tag>
          <Tag>{level.label}</Tag>
          <Tag>{lesson.duration} хв</Tag>
          {isCompleted && (
            <Tag tone="success" icon={<Icon name="check" size={13} />}>
              Завершено
            </Tag>
          )}
        </div>

        <h1 className={styles.title}>
          <span className={styles.order}>Урок {lesson.order}</span>
          {lesson.title}
        </h1>
        <p className={styles.summary}>{lesson.summary}</p>

        {tasks.length > 0 && (
          <ProgressBar
            className={styles.progress}
            label="Задачі уроку"
            value={solvedCount}
            max={tasks.length}
            hint={`${solvedCount}/${tasks.length}`}
            tone={solvedCount === tasks.length ? 'success' : 'brand'}
          />
        )}
      </header>

      <section className={styles.theory}>
        <h2 className={styles.sectionTitle}>Теорія</h2>
        <LessonViewer blocks={lesson.theory} />
      </section>

      {tasks.length > 0 && (
        <section className={styles.practice}>
          <h2 className={styles.sectionTitle}>Практика</h2>
          <div className={styles.tasks}>
            {tasks.map((task, index) => (
              <TaskRunner key={task.id} task={task} index={index + 1} />
            ))}
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <Button
          variant={isCompleted ? 'secondary' : 'primary'}
          onClick={toggleCompleted}
          iconLeft={<Icon name={isCompleted ? 'reset' : 'check'} size={16} />}
        >
          {isCompleted ? 'Позначити як незавершений' : 'Позначити урок завершеним'}
        </Button>

        <nav className={styles.pager} aria-label="Навігація уроками">
          {previous ? (
            <Link to={`/lessons/${previous.id}`} className={styles.pagerLink}>
              <Icon name="arrowLeft" size={16} />
              <span>
                <small>Попередній</small>
                {previous.title}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link to={`/lessons/${next.id}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
              <span>
                <small>Наступний</small>
                {next.title}
              </span>
              <Icon name="arrowRight" size={16} />
            </Link>
          )}
        </nav>
      </footer>
    </article>
  );
}

export default LessonDetail;
