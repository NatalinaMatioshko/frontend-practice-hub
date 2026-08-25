import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { ProgressTracker } from '../components/progress/ProgressTracker.jsx';
import { LessonCard } from '../components/lessons/LessonCard.jsx';
import { orderedLessons } from '../data/lessons.js';
import { tasks } from '../data/tasks.js';
import { useProgress } from '../hooks/useProgress.js';
import styles from './Home.module.css';

const FEATURES = [
  {
    icon: 'book',
    title: 'Теорія без води',
    text: 'Короткі уроки з прикладами коду, які пояснюють саме те, що знадобиться на практиці.',
  },
  {
    icon: 'code',
    title: 'Задачі з перевіркою',
    text: 'Пиши рішення в редакторі та запускай тести — код виконується прямо в браузері.',
  },
  {
    icon: 'chart',
    title: 'Видимий прогрес',
    text: 'Бейджі, серії днів і статистика активності показують, наскільки ти просунувся.',
  },
];

export function Home() {
  const { stats, progress } = useProgress();

  const nextLesson =
    orderedLessons.find((lesson) => !progress.lessons[lesson.id]?.completedAt) ??
    orderedLessons[0];
  const hasStarted = stats.viewedLessons > 0;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <Tag tone="brand">JavaScript · React · Практика</Tag>
          <h1 className={styles.title}>
            Вивчай <span className={styles.gradient}>JavaScript і React</span> через код, а не через
            конспекти
          </h1>
          <p className={styles.subtitle}>
            {orderedLessons.length} уроків і {tasks.length} задач із миттєвою перевіркою рішень.
            Читай теорію, пиши код у редакторі та відстежуй прогрес — усе локально, без реєстрації.
          </p>

          <div className={styles.actions}>
            <Button
              as={Link}
              to={`/lessons/${nextLesson.id}`}
              size="lg"
              iconRight={<Icon name="arrowRight" size={18} />}
            >
              {hasStarted ? 'Продовжити навчання' : 'Почати з першого уроку'}
            </Button>
            <Button as={Link} to="/practice" size="lg" variant="secondary">
              Одразу до задач
            </Button>
          </div>

          <dl className={styles.metrics}>
            <div>
              <dt>Уроків</dt>
              <dd>{stats.totalLessons}</dd>
            </div>
            <div>
              <dt>Задач</dt>
              <dd>{stats.totalTasks}</dd>
            </div>
            <div>
              <dt>Твої бали</dt>
              <dd>{stats.points}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.heroAside}>
          <ProgressTracker />
          {hasStarted && (
            <Card className={styles.resume}>
              <p className={styles.resumeLabel}>Наступний крок</p>
              <p className={styles.resumeTitle}>{nextLesson.title}</p>
              <p className={styles.resumeText}>{nextLesson.summary}</p>
              <Button as={Link} to={`/lessons/${nextLesson.id}`} variant="soft" size="sm" fullWidth>
                Відкрити урок
              </Button>
            </Card>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Як це працює</h2>
        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <Card key={feature.title} className={styles.feature}>
              <span className={styles.featureIcon}>
                <Icon name={feature.icon} size={20} />
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2>Швидкий старт</h2>
          <Link to="/lessons" className={styles.sectionLink}>
            Усі уроки
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
        <div className={styles.lessons}>
          {orderedLessons.slice(0, 3).map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
