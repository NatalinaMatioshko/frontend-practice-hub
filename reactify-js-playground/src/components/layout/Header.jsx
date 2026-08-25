import { Link, NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { useProgress } from '../../hooks/useProgress.js';
import { useTheme } from '../../hooks/useTheme.js';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'Головна', end: true },
  { to: '/lessons', label: 'Уроки' },
  { to: '/practice', label: 'Практика' },
  { to: '/progress', label: 'Прогрес' },
  { to: '/about', label: 'Про проєкт' },
];

export function Header({ onToggleSidebar, sidebarOpen }) {
  const { stats } = useProgress();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.burger}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Закрити меню' : 'Відкрити меню'}
          aria-expanded={sidebarOpen}
        >
          <Icon name={sidebarOpen ? 'cross' : 'menu'} />
        </button>

        <Link to="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            R
          </span>
          <span className={styles.brandText}>
            <strong>Reactify</strong>
            <small>JS Playground</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Основна навігація">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.score} title="Зароблені бали">
            <Icon name="spark" size={16} />
            {stats.points}
          </span>
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
