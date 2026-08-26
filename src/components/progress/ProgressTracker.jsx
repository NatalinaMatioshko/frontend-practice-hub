import { ProgressBar } from '../ui/ProgressBar.jsx';
import { Card } from '../ui/Card.jsx';
import { TRACKS } from '../../data/lessons.js';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './ProgressTracker.module.css';

export function ProgressTracker({ compact = false }) {
  const { stats } = useProgress();
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - stats.lessonPercent / 100);

  return (
    <Card className={`${styles.tracker} ${compact ? styles.compact : ''}`}>
      <div className={styles.ring}>
        <svg viewBox="0 0 120 120" className={styles.ringSvg} role="img" aria-label={`Пройдено ${stats.lessonPercent}%`}>
          <defs>
            <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle className={styles.ringTrack} cx="60" cy="60" r="52" />
          <circle
            className={styles.ringFill}
            cx="60"
            cy="60"
            r="52"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={styles.ringLabel}>
          <strong>{stats.lessonPercent}%</strong>
          <span>уроків</span>
        </div>
      </div>

      <div className={styles.details}>
        <p className={styles.headline}>
          Завершено <strong>{stats.completedLessons}</strong> із {stats.totalLessons} уроків та{' '}
          <strong>{stats.solvedTasks}</strong> із {stats.totalTasks} задач.
        </p>

        <div className={styles.bars}>
          {Object.values(TRACKS).map((track) => {
            const trackStats = stats.byTrack[track.id];
            return (
              <ProgressBar
                key={track.id}
                label={track.label}
                tone={track.color}
                size="sm"
                value={trackStats.completed}
                max={trackStats.total}
                hint={`${trackStats.completed}/${trackStats.total}`}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export default ProgressTracker;
