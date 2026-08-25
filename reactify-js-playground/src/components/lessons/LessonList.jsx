import { useMemo, useState } from 'react';
import { LessonCard } from './LessonCard.jsx';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { LEVELS, orderedLessons, TRACKS } from '../../data/lessons.js';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './LessonList.module.css';

const TRACK_FILTERS = [{ id: 'all', label: 'Усі напрями' }, ...Object.values(TRACKS)];
const LEVEL_FILTERS = [{ id: 'all', label: 'Будь-який рівень' }, ...Object.values(LEVELS)];
const STATUS_FILTERS = [
  { id: 'all', label: 'Усі' },
  { id: 'todo', label: 'Незавершені' },
  { id: 'done', label: 'Завершені' },
];

const DEFAULT_FILTERS = { track: 'all', level: 'all', status: 'all', query: '' };

export function LessonList({ lessons = orderedLessons, initialTrack = 'all' }) {
  const { progress } = useProgress();
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, track: initialTrack });

  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  const visible = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return lessons.filter((lesson) => {
      if (filters.track !== 'all' && lesson.track !== filters.track) return false;
      if (filters.level !== 'all' && lesson.level !== filters.level) return false;

      const isDone = Boolean(progress.lessons[lesson.id]?.completedAt);
      if (filters.status === 'done' && !isDone) return false;
      if (filters.status === 'todo' && isDone) return false;

      if (!query) return true;
      return [lesson.title, lesson.summary, ...lesson.tags]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [lessons, filters, progress.lessons]);

  const isFiltered =
    filters.track !== 'all' ||
    filters.level !== 'all' ||
    filters.status !== 'all' ||
    filters.query !== '';

  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        <div className={styles.search}>
          <Icon name="compass" size={18} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.input}
            placeholder="Пошук за назвою або темою"
            value={filters.query}
            onChange={(event) => setFilter('query', event.target.value)}
            aria-label="Пошук уроків"
          />
        </div>

        <div className={styles.chipRow} role="group" aria-label="Фільтр за напрямом">
          {TRACK_FILTERS.map((option) => (
            <FilterChip
              key={option.id}
              active={filters.track === option.id}
              onClick={() => setFilter('track', option.id)}
            >
              {option.icon && <Icon name={option.icon} size={15} />}
              {option.label}
            </FilterChip>
          ))}
        </div>

        <div className={styles.selects}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Рівень</span>
            <select
              className={styles.select}
              value={filters.level}
              onChange={(event) => setFilter('level', event.target.value)}
            >
              {LEVEL_FILTERS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Статус</span>
            <select
              className={styles.select}
              value={filters.status}
              onChange={(event) => setFilter('status', event.target.value)}
            >
              {STATUS_FILTERS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
              Скинути
            </Button>
          )}
        </div>
      </div>

      <p className={styles.count} aria-live="polite">
        Знайдено уроків: <strong>{visible.length}</strong>
      </p>

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <Icon name="compass" size={32} />
          <p>За такими фільтрами уроків немає. Спробуй змінити критерії пошуку.</p>
          <Button variant="secondary" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Показати всі уроки
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {visible.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.chipActive : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

export default LessonList;
