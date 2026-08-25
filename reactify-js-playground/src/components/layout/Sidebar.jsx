import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { ProgressBar } from '../ui/ProgressBar.jsx';
import { LessonNav } from '../navigation/LessonNav.jsx';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './Sidebar.module.css';

const SECTIONS = [
  { to: '/', label: 'Головна', icon: 'home', end: true },
  { to: '/lessons', label: 'Усі уроки', icon: 'book' },
  { to: '/practice', label: 'Практика', icon: 'code' },
  { to: '/progress', label: 'Прогрес', icon: 'chart' },
  { to: '/about', label: 'Про проєкт', icon: 'info' },
];

export function Sidebar({ open, onNavigate }) {
  const { stats } = useProgress();

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={onNavigate}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${open ? styles.open : ''}`} aria-label="Бічна навігація">
        <nav className={styles.section}>
          <p className={styles.sectionTitle}>Навігація</p>
          {SECTIONS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) => (isActive ? `${styles.item} ${styles.active}` : styles.item)}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.section}>
          <p className={styles.sectionTitle}>Програма курсу</p>
          <LessonNav onNavigate={onNavigate} />
        </div>

        <div className={styles.progressCard}>
          <ProgressBar
            label="Загальний прогрес"
            value={stats.completedLessons}
            max={stats.totalLessons}
            hint={`${stats.completedLessons}/${stats.totalLessons}`}
            size="sm"
          />
          <p className={styles.progressHint}>
            Розвʼязано задач: <strong>{stats.solvedTasks}</strong> із {stats.totalTasks}
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
