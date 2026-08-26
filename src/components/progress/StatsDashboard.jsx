import { useMemo } from 'react';
import { Card } from '../ui/Card.jsx';
import { Icon } from '../ui/Icon.jsx';
import { useProgress } from '../../hooks/useProgress.js';
import { formatDay, toDateKey } from '../../utils/date.js';
import styles from './StatsDashboard.module.css';

const ACTIVITY_DAYS = 21;

export function StatsDashboard() {
  const { stats } = useProgress();

  const tiles = [
    { icon: 'spark', label: 'Бали', value: stats.points, hint: 'за розвʼязані задачі' },
    { icon: 'book', label: 'Уроків завершено', value: `${stats.completedLessons}/${stats.totalLessons}` },
    { icon: 'code', label: 'Задач розвʼязано', value: `${stats.solvedTasks}/${stats.totalTasks}` },
    { icon: 'play', label: 'Спроб перевірки', value: stats.attempts },
    { icon: 'fire', label: 'Серія днів', value: stats.streak, hint: 'поспіль із практикою' },
    { icon: 'calendar', label: 'Активних днів', value: stats.activeDays },
  ];

  const days = useMemo(() => buildActivityWindow(stats.activity, ACTIVITY_DAYS), [stats.activity]);
  const maxRuns = Math.max(1, ...days.map((day) => day.runs));

  return (
    <div className={styles.dashboard}>
      <div className={styles.tiles}>
        {tiles.map((tile) => (
          <Card key={tile.label} padding="sm" className={styles.tile}>
            <span className={styles.tileIcon}>
              <Icon name={tile.icon} size={18} />
            </span>
            <div>
              <p className={styles.tileValue}>{tile.value}</p>
              <p className={styles.tileLabel}>{tile.label}</p>
              {tile.hint && <p className={styles.tileHint}>{tile.hint}</p>}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className={styles.sectionTitle}>Активність за останні три тижні</h3>
        <div className={styles.heatmap}>
          {days.map((day) => (
            <div
              key={day.date}
              className={styles.cell}
              style={{ '--intensity': day.runs === 0 ? 0 : 0.25 + (day.runs / maxRuns) * 0.75 }}
              title={`${formatDay(day.date)} — перевірок: ${day.runs}, розвʼязано: ${day.solved}`}
            >
              <span className="visually-hidden">
                {formatDay(day.date)}: {day.runs} перевірок
              </span>
            </div>
          ))}
        </div>
        <div className={styles.legend}>
          <span>Період: {formatDay(days[0].date)} — {formatDay(days[days.length - 1].date)}</span>
          <span className={styles.legendScale}>
            менше
            <i style={{ '--intensity': 0 }} />
            <i style={{ '--intensity': 0.35 }} />
            <i style={{ '--intensity': 0.7 }} />
            <i style={{ '--intensity': 1 }} />
            більше
          </span>
        </div>
      </Card>
    </div>
  );
}

function buildActivityWindow(activity, length) {
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (length - 1));

  for (let index = 0; index < length; index += 1) {
    const date = toDateKey(cursor);
    const entry = activity[date] ?? { runs: 0, solved: 0 };
    days.push({ date, runs: entry.runs ?? 0, solved: entry.solved ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

export default StatsDashboard;
