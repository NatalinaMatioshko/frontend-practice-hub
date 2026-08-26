import { Link } from 'react-router-dom';
import { Card } from '../ui/Card.jsx';
import { Tag } from '../ui/Tag.jsx';
import { Icon } from '../ui/Icon.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { LEVELS, TRACKS } from '../../data/lessons.js';
import { getTasksForLesson } from '../../data/tasks.js';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './LessonCard.module.css';

export function LessonCard({ lesson }) {
  const { progress } = useProgress();

  const track = TRACKS[lesson.track];
  const level = LEVELS[lesson.level];
  const lessonTasks = getTasksForLesson(lesson.id);
  const solved = lessonTasks.filter((task) => progress.tasks[task.id]?.solvedAt).length;

  const state = progress.lessons[lesson.id];
  const isDone = Boolean(state?.completedAt);
  const isStarted = Boolean(state?.viewedAt) && !isDone;

  return (
    <Card as="article" interactive className={styles.card}>
      <div className={styles.top}>
        <span className={`${styles.trackIcon} ${styles[track.color]}`}>
          <Icon name={track.icon} size={20} />
        </span>

        <div className={styles.tags}>
          <Tag tone={track.color}>{track.label}</Tag>
          <Tag>{level.label}</Tag>
        </div>

        {isDone && (
          <span className={styles.doneBadge} title="Урок завершено">
            <Icon name="check" size={14} />
          </span>
        )}
      </div>

      <h3 className={styles.title}>
        <Link to={`/lessons/${lesson.id}`} className={styles.titleLink}>
          <span className={styles.order}>{String(lesson.order).padStart(2, '0')}</span>
          {lesson.title}
        </Link>
      </h3>

      <p className={styles.summary}>{lesson.summary}</p>

      <ul className={styles.meta}>
        <li>{lesson.duration} хв</li>
        <li>
          {lessonTasks.length} {declineTasks(lessonTasks.length)}
        </li>
        {isStarted && <li className={styles.inProgress}>Розпочато</li>}
      </ul>

      {lessonTasks.length > 0 && (
        <ProgressBar
          value={solved}
          max={lessonTasks.length}
          size="sm"
          tone={solved === lessonTasks.length ? 'success' : track.color}
          label="Задачі"
          hint={`${solved}/${lessonTasks.length}`}
        />
      )}
    </Card>
  );
}

function declineTasks(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'задача';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'задачі';
  return 'задач';
}

export default LessonCard;
