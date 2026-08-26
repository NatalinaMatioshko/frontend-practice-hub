# Reactify & JS Playground

Інтерактивний застосунок для вивчення JavaScript і React: теорія, задачі з автоматичною
перевіркою коду просто в браузері та відстеження прогресу в `localStorage`.

## Швидкий старт

```bash
npm install
npm run dev
```

Застосунок буде доступний на `http://localhost:5173`.

| Команда | Опис |
| --- | --- |
| `npm run dev` | Dev-сервер із HMR |
| `npm run build` | Продакшн-збірка у `dist/` |
| `npm run preview` | Локальний перегляд зібраного бандлу |
| `npm run lint` | Статичний аналіз (oxlint) |
| `npm run verify` | Перевірка контенту: усі еталонні рішення проходять свої тести |

## Стек

- **React 19** — функціональні компоненти та хуки
- **React Router v7** — клієнтська навігація
- **Vite** — збірка та dev-сервер
- **CSS Modules** — ізольовані стилі
- **Web Worker** — виконання коду задач в окремому потоці
- **localStorage** — збереження прогресу без бекенду

## Структура

```
src/
├── components/
│   ├── ui/          Button, Card, ProgressBar, Modal, Tag, Icon
│   ├── layout/      Header, Sidebar, Footer, Layout
│   ├── lessons/     LessonList, LessonCard, LessonViewer, CodeEditor, TaskRunner, SolutionChecker
│   ├── progress/    ProgressTracker, AchievementBadge, StatsDashboard
│   └── navigation/  LessonNav, Breadcrumbs
├── pages/           Home, Lessons, LessonDetail, Practice, Progress, About, NotFound
├── data/            lessons.js, tasks.js, solutions.js, achievements.js
├── hooks/           useProgress, useLesson, useCodeEditor, useLocalStorage, useTheme
├── context/         ProgressContext, ThemeContext
├── utils/           codeValidator, taskChecker, runnerCore, sandbox.worker, storage, format, date
├── styles/          index.css, variables.css
├── App.jsx
└── main.jsx
```

## Як перевіряється код

1. **Статична перевірка** (`utils/codeValidator.js`) — синтаксис плюс правила задачі
   (`required` / `forbidden` патерни, наприклад «використай `.reduce()`»). Коментарі та рядкові
   літерали вирізаються перед матчингом, щоб підказка в коментарі не «зараховувалась».
2. **Виконання** (`utils/taskChecker.js` → `utils/sandbox.worker.js`) — код запускається у Web
   Worker. Це ізолює його від сторінки й дозволяє перервати нескінченний цикл за таймаутом
   (2.5 с). Якщо воркери недоступні, використовується синхронний fallback.
3. **Порівняння** (`utils/runnerCore.js`) — глибока рівність для масивів, обʼєктів, `Map`, `Set`,
   `Date`, з коректною обробкою `NaN` і `-0`.

Небезпечні глобальні обʼєкти (`fetch`, `localStorage`, `XMLHttpRequest`, `indexedDB`) затінюються
параметрами функції, тому код учня їх не бачить.

## Формат задачі

```js
{
  id: 'js-arrays-paid-total',
  lessonId: 'js-arrays',
  title: 'Сума оплачених замовлень',
  difficulty: 'medium',          // easy | medium | hard
  exportName: 'sumPaidOrders',   // функція, яку шукає перевірка
  starterCode: '…',
  hints: ['…'],
  rules: {
    required:  [{ pattern: /\.filter\s*\(/, message: '…' }],
    forbidden: [{ pattern: /\bfor\s*\(/,    message: '…' }],
  },
  tests: [
    { args: [[…]], expected: 380 },
    // для задач, що повертають функцію:
    { args: [0], chain: [[], [], []], expected: 3 },
    // для аргументів-функцій (їх не можна передати у воркер як значення):
    { argsSource: ['(x) => x + 1'], chain: [[3]], expected: 4 },
  ],
}
```

Після додавання задачі запусти `npm run verify` — скрипт перевірить, що еталонне рішення з
`data/solutions.js` проходить усі тести й правила, а стартовий шаблон — ні.

## Збереження прогресу

Усі дані лежать у `localStorage` під префіксом `reactify:`:

- `reactify:progress` — переглянуті та завершені уроки, розвʼязані задачі, спроби, активність по днях
- `reactify:drafts` — незбережений код у редакторі для кожної задачі
- `reactify:theme` — світла або темна тема

Скинути прогрес можна на сторінці «Прогрес». Чернетки коду при цьому лишаються.
