import { useSearchParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.jsx';
import { LessonList } from '../components/lessons/LessonList.jsx';
import { TRACKS } from '../data/lessons.js';
import styles from './Lessons.module.css';

export function Lessons() {
  const [searchParams] = useSearchParams();
  const trackParam = searchParams.get('track');
  const initialTrack = trackParam && TRACKS[trackParam] ? trackParam : 'all';

  return (
    <div className={styles.page}>
      <Breadcrumbs items={[{ label: 'Головна', to: '/' }, { label: 'Уроки' }]} />

      <header className={styles.header}>
        <h1>Уроки</h1>
        <p>
          Програма побудована послідовно: спершу основи JavaScript, далі React. Кожен урок містить
          теорію, приклади та задачі з автоматичною перевіркою.
        </p>
      </header>

      <LessonList key={initialTrack} initialTrack={initialTrack} />
    </div>
  );
}

export default Lessons;
