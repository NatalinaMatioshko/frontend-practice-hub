import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/navigation/Breadcrumbs.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Icon } from '../components/ui/Icon.jsx';
import { Button } from '../components/ui/Button.jsx';
import styles from './About.module.css';

const STACK = [
  { name: 'React 19', note: 'функціональні компоненти та хуки' },
  { name: 'React Router', note: 'клієнтська навігація' },
  { name: 'Vite', note: 'збірка та dev-сервер' },
  { name: 'CSS Modules', note: 'ізольовані стилі без конфліктів' },
  { name: 'Web Worker', note: 'ізольоване виконання коду задач' },
  { name: 'localStorage', note: 'збереження прогресу' },
];

const FLOW = [
  {
    icon: 'book',
    title: 'Читаєш теорію',
    text: 'Кожен урок — це стислий конспект із прикладами та застереженнями про типові помилки.',
  },
  {
    icon: 'code',
    title: 'Пишеш код',
    text: 'Задача відкривається в редакторі з підготовленим шаблоном. Ctrl + Enter запускає перевірку.',
  },
  {
    icon: 'check',
    title: 'Отримуєш результат',
    text: 'Тести показують очікуване й фактичне значення для кожного випадку, а підказки зʼявляються поступово.',
  },
  {
    icon: 'chart',
    title: 'Бачиш прогрес',
    text: 'Розвʼязані задачі дають бали, закривають уроки та відкривають бейджі досягнень.',
  },
];

export function About() {
  return (
    <div className={styles.page}>
      <Breadcrumbs items={[{ label: 'Головна', to: '/' }, { label: 'Про проєкт' }]} />

      <header className={styles.header}>
        <h1>Про проєкт</h1>
        <p>
          Reactify &amp; JS Playground — навчальний майданчик, де теорія одразу підкріплюється
          практикою. Жодних акаунтів і серверів: усе працює в браузері, а прогрес зберігається
          локально.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Як влаштоване навчання</h2>
        <div className={styles.flow}>
          {FLOW.map((step, index) => (
            <Card key={step.title} className={styles.step}>
              <span className={styles.stepIndex}>{index + 1}</span>
              <span className={styles.stepIcon}>
                <Icon name={step.icon} size={18} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Як перевіряється код</h2>
        <Card>
          <p className={styles.text}>
            Рішення спершу проходить статичну перевірку: синтаксис і правила задачі (наприклад,
            «використай <code>.reduce()</code>» або «обійдись без циклу <code>for</code>»). Далі код
            виконується у Web Worker — окремому потоці, який ізольований від сторінки та може бути
            зупинений, якщо в коді трапиться нескінченний цикл.
          </p>
          <p className={styles.text}>
            Кожна задача має таблицю тестів: набір аргументів і очікуваний результат. Порівняння
            глибоке, тому масиви й обʼєкти звіряються за вмістом, а не за посиланням.
          </p>
        </Card>
      </section>

      <section className={styles.section}>
        <h2>Технології</h2>
        <ul className={styles.stack}>
          {STACK.map((item) => (
            <li key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <Card className={styles.cta}>
        <div>
          <h2>Готовий почати?</h2>
          <p>Перший урок займе близько 12 хвилин разом із задачами.</p>
        </div>
        <Button as={Link} to="/lessons" size="lg" iconRight={<Icon name="arrowRight" size={18} />}>
          До списку уроків
        </Button>
      </Card>
    </div>
  );
}

export default About;
