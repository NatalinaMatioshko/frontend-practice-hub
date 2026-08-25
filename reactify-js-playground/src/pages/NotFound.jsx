import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import styles from './NotFound.module.css';

export function NotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1>Такої сторінки немає</h1>
      <p className={styles.text}>
        Можливо, посилання застаріло або в адресі є помилка. Повернись до списку уроків і продовжуй
        навчання.
      </p>
      <Button as={Link} to="/lessons" iconRight={<Icon name="arrowRight" size={16} />}>
        До уроків
      </Button>
    </div>
  );
}

export default NotFound;
