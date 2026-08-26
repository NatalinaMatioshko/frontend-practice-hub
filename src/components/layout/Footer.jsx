import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          <strong>Reactify &amp; JS Playground</strong> — навчальний майданчик для JavaScript і React.
          Прогрес зберігається локально у твоєму браузері.
        </p>
        <nav className={styles.links} aria-label="Додаткова навігація">
          <Link to="/lessons">Уроки</Link>
          <Link to="/practice">Практика</Link>
          <Link to="/progress">Прогрес</Link>
          <Link to="/about">Про проєкт</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
