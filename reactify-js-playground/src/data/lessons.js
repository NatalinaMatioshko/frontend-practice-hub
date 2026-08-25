export const TRACKS = {
  javascript: { id: 'javascript', label: 'JavaScript', icon: 'js', color: 'js' },
  react: { id: 'react', label: 'React', icon: 'react', color: 'react' },
};

export const LEVELS = {
  beginner: { id: 'beginner', label: 'Початковий', weight: 1 },
  intermediate: { id: 'intermediate', label: 'Середній', weight: 2 },
  advanced: { id: 'advanced', label: 'Просунутий', weight: 3 },
};

export const lessons = [
  {
    id: 'js-variables',
    order: 1,
    track: 'javascript',
    level: 'beginner',
    title: 'Змінні та типи даних',
    summary:
      'Різниця між let, const і var, примітивні типи та як JavaScript приводить значення до інших типів.',
    duration: 12,
    tags: ['основи', 'типи', 'scope'],
    theory: [
      {
        type: 'paragraph',
        text: 'У JavaScript є три способи оголосити змінну, але в сучасному коді використовують лише два: `const` і `let`. `var` залишився з часів ES5 і має неочевидну поведінку зі скоупом.',
      },
      {
        type: 'list',
        items: [
          '`const` — привʼязка, яку не можна перепризначити. Це вибір за замовчуванням.',
          '`let` — привʼязка, значення якої змінюється з часом (лічильники, акумулятори).',
          '`var` — функціональний скоуп і hoisting, через що легко отримати баг.',
        ],
      },
      {
        type: 'code',
        caption: 'Блоковий скоуп у дії',
        code: `const total = 100;
let counter = 0;

if (true) {
  let counter = 42; // окрема змінна всередині блоку
  console.log(counter); // 42
}

console.log(counter); // 0
console.log(total);   // 100`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'const не означає «незмінний»',
        text: 'Забороняється перепризначення самої змінної, а не мутація обʼєкта. `const user = {}` дозволяє `user.name = "Ada"`, але не `user = {}`.',
      },
      { type: 'heading', text: 'Примітивні типи' },
      {
        type: 'paragraph',
        text: 'Примітивів сім: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null`. Усе інше — обʼєкти, включно з масивами та функціями.',
      },
      {
        type: 'code',
        caption: 'typeof та відомі підводні камені',
        code: `typeof 'hello';     // 'string'
typeof 42;          // 'number'
typeof undefined;   // 'undefined'
typeof null;        // 'object'  <- історичний баг мови
typeof [];          // 'object'
typeof (() => {});  // 'function'

Array.isArray([]);  // true — надійна перевірка масиву`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Порівнюй через ===',
        text: '`==` виконує приведення типів: `0 == "0"` дає true, а `0 === "0"` — false. Використовуй `===` завжди, крім свідомої перевірки `value == null`.',
      },
    ],
  },
  {
    id: 'js-functions',
    order: 2,
    track: 'javascript',
    level: 'beginner',
    title: 'Функції та стрілочний синтаксис',
    summary:
      'Оголошення функцій, стрілочні функції, параметри за замовчуванням, rest/spread і замикання.',
    duration: 15,
    tags: ['функції', 'closures', 'ES6'],
    theory: [
      {
        type: 'paragraph',
        text: 'Функція — це значення. Її можна передати в іншу функцію, зберегти в масиві чи повернути з іншої функції. Саме тому в JavaScript працюють колбеки й функції вищого порядку.',
      },
      {
        type: 'code',
        caption: 'Три форми запису',
        code: `// оголошення функції (hoisted)
function double(n) {
  return n * 2;
}

// функціональний вираз
const triple = function (n) {
  return n * 3;
};

// стрілочна функція з неявним return
const quadruple = (n) => n * 4;`,
      },
      { type: 'heading', text: 'Параметри за замовчуванням і rest' },
      {
        type: 'code',
        code: `function greet(name, greeting = 'Привіт') {
  return \`\${greeting}, \${name}!\`;
}

function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

greet('Ada');            // 'Привіт, Ada!'
greet('Ada', 'Вітаю');   // 'Вітаю, Ada!'
sum(1, 2, 3, 4);         // 10`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Стрілки не мають власного this',
        text: 'Стрілочна функція бере `this` із зовнішнього скоупу. Це зручно для колбеків, але робить її непридатною для методів обʼєкта, які покладаються на динамічний `this`.',
      },
      { type: 'heading', text: 'Замикання' },
      {
        type: 'paragraph',
        text: 'Замикання — це функція разом зі змінними того місця, де її створили. Внутрішня функція памʼятає зовнішні змінні навіть після завершення зовнішнього виклику.',
      },
      {
        type: 'code',
        caption: 'Лічильник на замиканні',
        code: `function createCounter(start = 0) {
  let value = start;
  return {
    increment: () => ++value,
    current: () => value,
  };
}

const counter = createCounter(10);
counter.increment(); // 11
counter.current();   // 11`,
      },
    ],
  },
  {
    id: 'js-arrays',
    order: 3,
    track: 'javascript',
    level: 'intermediate',
    title: 'Методи масивів',
    summary:
      'map, filter, reduce, find і сортування — декларативна робота з колекціями замість циклів.',
    duration: 18,
    tags: ['масиви', 'map', 'reduce'],
    theory: [
      {
        type: 'paragraph',
        text: 'Методи масивів дозволяють описувати *що* треба отримати, а не *як* це обійти. Код стає коротшим і легшим для читання, а більшість методів не мутують вихідний масив.',
      },
      {
        type: 'list',
        items: [
          '`map` — той самий розмір, інші значення.',
          '`filter` — та сама форма елементів, менша кількість.',
          '`reduce` — згортає масив у одне значення будь-якого типу.',
          '`find` / `some` / `every` — пошук і перевірки, повертають перший збіг або boolean.',
        ],
      },
      {
        type: 'code',
        caption: 'Ланцюжок методів',
        code: `const orders = [
  { id: 1, total: 120, paid: true },
  { id: 2, total: 80, paid: false },
  { id: 3, total: 260, paid: true },
];

const paidTotal = orders
  .filter((order) => order.paid)
  .map((order) => order.total)
  .reduce((sum, total) => sum + total, 0);

paidTotal; // 380`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'sort мутує масив',
        text: '`sort` і `reverse` змінюють вихідний масив і сортують як рядки за замовчуванням. Копіюй перед сортуванням: `[...items].sort((a, b) => a - b)`.',
      },
      { type: 'heading', text: 'reduce поза сумами' },
      {
        type: 'code',
        caption: 'Групування за ключем',
        code: `const people = [
  { name: 'Ada', role: 'dev' },
  { name: 'Linus', role: 'dev' },
  { name: 'Grace', role: 'ops' },
];

const byRole = people.reduce((acc, person) => {
  acc[person.role] = [...(acc[person.role] ?? []), person.name];
  return acc;
}, {});

// { dev: ['Ada', 'Linus'], ops: ['Grace'] }`,
      },
    ],
  },
  {
    id: 'react-components',
    order: 4,
    track: 'react',
    level: 'beginner',
    title: 'Компоненти та props',
    summary:
      'Функціональні компоненти, передача даних через props, композиція та рендер списків із key.',
    duration: 16,
    tags: ['компоненти', 'props', 'JSX'],
    theory: [
      {
        type: 'paragraph',
        text: 'Компонент React — це функція, яка отримує обʼєкт `props` і повертає опис інтерфейсу (JSX). Той самий набір props завжди дає той самий результат — компонент має бути чистою функцією.',
      },
      {
        type: 'code',
        caption: 'Компонент із props',
        code: `function LessonCard({ title, duration, onOpen }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{duration} хв</p>
      <button onClick={onOpen}>Відкрити</button>
    </article>
  );
}

<LessonCard title="Масиви" duration={18} onOpen={open} />`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'props лише для читання',
        text: 'Компонент ніколи не змінює свої props. Щоб дані змінилися, батьківський компонент має передати нові — або передати колбек, який оновить його власний стан.',
      },
      { type: 'heading', text: 'Композиція замість наслідування' },
      {
        type: 'code',
        code: `function Panel({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Panel title="Прогрес">
  <ProgressBar value={62} />
</Panel>`,
      },
      { type: 'heading', text: 'Списки та key' },
      {
        type: 'paragraph',
        text: '`key` дає React стабільну ідентичність елемента між рендерами. Індекс масиву як key ламає стан і анімації, щойно список змінює порядок.',
      },
      {
        type: 'code',
        code: `{lessons.map((lesson) => (
  <LessonCard key={lesson.id} title={lesson.title} />
))}`,
      },
    ],
  },
  {
    id: 'react-state',
    order: 5,
    track: 'react',
    level: 'intermediate',
    title: 'Стан і useState',
    summary:
      'Як useState зберігає дані між рендерами, чому оновлення асинхронні та коли потрібна функція-оновлювач.',
    duration: 20,
    tags: ['useState', 'стан', 'хуки'],
    theory: [
      {
        type: 'paragraph',
        text: '`useState` повертає пару: поточне значення та функцію оновлення. Виклик оновлення планує повторний рендер — змінна в поточному рендері залишається старою.',
      },
      {
        type: 'code',
        caption: 'Базовий лічильник',
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Кліків: {count}
    </button>
  );
}`,
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Оновлення батчаться',
        text: 'Три поспіль виклики `setCount(count + 1)` дадуть +1, бо всі читають одне й те саме `count`. Використовуй `setCount((prev) => prev + 1)`, коли нове значення залежить від старого.',
      },
      { type: 'heading', text: 'Стан має бути незмінним' },
      {
        type: 'code',
        code: `// ❌ мутація — React не побачить змін
items.push(newItem);
setItems(items);

// ✅ новий масив
setItems([...items, newItem]);

// ✅ новий обʼєкт
setUser({ ...user, name: 'Ada' });`,
      },
      {
        type: 'list',
        items: [
          'Тримай стан якомога ближче до місця використання.',
          'Не дублюй у стані те, що можна обчислити з наявних даних.',
          'Піднімай стан до спільного предка, коли його потребують кілька компонентів.',
        ],
      },
    ],
  },
  {
    id: 'react-effects',
    order: 6,
    track: 'react',
    level: 'advanced',
    title: 'Побічні ефекти та useEffect',
    summary:
      'Синхронізація із зовнішніми системами, масив залежностей, функція очищення та типові помилки.',
    duration: 22,
    tags: ['useEffect', 'lifecycle', 'cleanup'],
    theory: [
      {
        type: 'paragraph',
        text: '`useEffect` синхронізує компонент із зовнішнім світом: підписки, таймери, запити, DOM API. Якщо значення можна просто обчислити під час рендеру — ефект не потрібен.',
      },
      {
        type: 'code',
        caption: 'Ефект із очищенням',
        code: `useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 1000);
  return () => clearInterval(id);
}, []);`,
      },
      {
        type: 'list',
        items: [
          'Без масиву залежностей — ефект виконується після кожного рендеру.',
          '`[]` — один раз після монтування.',
          '`[a, b]` — щоразу, коли `a` або `b` змінюються за `Object.is`.',
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        title: 'Гонки запитів',
        text: 'Повільна відповідь може перезаписати свіжу. Використовуй прапорець скасування або `AbortController` у функції очищення.',
      },
      {
        type: 'code',
        caption: 'Захист від застарілої відповіді',
        code: `useEffect(() => {
  let cancelled = false;

  loadLesson(lessonId).then((data) => {
    if (!cancelled) setLesson(data);
  });

  return () => {
    cancelled = true;
  };
}, [lessonId]);`,
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Коли ефект зайвий',
        text: 'Фільтрація списку, обчислення суми чи форматування — це похідні дані. Рахуй їх під час рендеру, за потреби обгорнувши в `useMemo`.',
      },
    ],
  },
];

export const lessonsById = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));

export const orderedLessons = [...lessons].sort((a, b) => a.order - b.order);

export function getLessonById(id) {
  return lessonsById[id] ?? null;
}

export function getAdjacentLessons(id) {
  const index = orderedLessons.findIndex((lesson) => lesson.id === id);
  if (index === -1) return { previous: null, next: null };
  return {
    previous: orderedLessons[index - 1] ?? null,
    next: orderedLessons[index + 1] ?? null,
  };
}
