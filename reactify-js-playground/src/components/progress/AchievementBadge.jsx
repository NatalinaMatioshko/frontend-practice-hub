import { Icon } from '../ui/Icon.jsx';
import styles from './AchievementBadge.module.css';

export function AchievementBadge({ achievement }) {
  const { title, description, icon, earned, current, target, percent } = achievement;

  return (
    <div className={`${styles.badge} ${earned ? styles.earned : styles.locked}`}>
      <span className={styles.medal}>
        <Icon name={earned ? icon : 'lock'} size={22} />
      </span>

      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>

        {!earned && (
          <div className={styles.meter} aria-hidden="true">
            <span style={{ width: `${percent}%` }} />
          </div>
        )}
      </div>

      <span className={styles.counter}>
        {earned ? 'Отримано' : `${current}/${target}`}
      </span>
    </div>
  );
}

export default AchievementBadge;
