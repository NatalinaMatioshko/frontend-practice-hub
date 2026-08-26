import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { orderedLessons, TRACKS } from '../../data/lessons.js';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './LessonNav.module.css';

export function LessonNav({ onNavigate }) {
  const { progress } = useProgress();

  const groups = Object.values(TRACKS).map((track) => ({
    track,
    items: orderedLessons.filter((lesson) => lesson.track === track.id),
  }));

  return (
    <div className={styles.nav}>
      {groups.map(({ track, items }) => (
        <section key={track.id} className={styles.group}>
          <p className={styles.groupTitle}>
            <Icon name={track.icon} size={15} className={styles[track.color]} />
            {track.label}
          </p>

          <ul className={styles.list}>
            {items.map((lesson) => {
              const state = progress.lessons[lesson.id];
              const isDone = Boolean(state?.completedAt);

              return (
                <li key={lesson.id}>
                  <NavLink
                    to={`/lessons/${lesson.id}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      isActive ? `${styles.link} ${styles.active}` : styles.link
                    }
                  >
                    <span className={`${styles.marker} ${isDone ? styles.done : ''}`} aria-hidden="true">
                      {isDone ? <Icon name="check" size={11} /> : lesson.order}
                    </span>
                    <span className={styles.title}>{lesson.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default LessonNav;
