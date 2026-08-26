export const DIFFICULTIES = {
  easy: { id: 'easy', label: 'Легко', points: 10 },
  medium: { id: 'medium', label: 'Середньо', points: 20 },
  hard: { id: 'hard', label: 'Складно', points: 35 },
};

export const tasks = [
  {
    id: 'js-variables-describe',
    lessonId: 'js-variables',
    title: 'Точне визначення типу',
    difficulty: 'easy',
    description:
      'Оператор typeof повертає "object" і для null, і для масивів. Напиши функцію describeValue, яка усуває цю неоднозначність.',
    requirements: [
      'Для null поверни рядок "null".',
      'Для масиву поверни рядок "array".',
      'Для решти значень поверни звичайний результат typeof.',
    ],
    exportName: 'describeValue',
    starterCode: `function describeValue(value) {
  // Твій код тут
}`,
    hints: [
      'null треба перевірити окремо — до виклику typeof.',
      'Array.isArray() — єдина надійна перевірка масиву.',
    ],
    rules: {
      required: [
        {
          pattern: /Array\.isArray/,
          message: 'Використай Array.isArray() для перевірки масиву.',
        },
      ],
    },
    tests: [
      { args: ['hello'], expected: 'string' },
      { args: [42], expected: 'number' },
      { args: [true], expected: 'boolean' },
      { args: [null], expected: 'null' },
      { args: [[1, 2, 3]], expected: 'array' },
      { args: [[]], expected: 'array' },
      { args: [{ a: 1 }], expected: 'object' },
      { args: [undefined], expected: 'undefined' },
    ],
  },
  {
    id: 'js-variables-parse-score',
    lessonId: 'js-variables',
    title: 'Безпечний парсинг числа',
    difficulty: 'easy',
    description:
      'Дані з форми завжди приходять рядками. Напиши parseScore, яка перетворює вхідне значення на число та повертає 0, якщо це неможливо.',
    requirements: [
      'Рядок із числом перетворюється на число: "3.5" → 3.5.',
      'Порожній рядок, пробіли та нечислові рядки дають 0.',
      'null та undefined також дають 0.',
    ],
    exportName: 'parseScore',
    starterCode: `function parseScore(input) {
  // Твій код тут
}`,
    hints: [
      'Number("") дорівнює 0, а Number("abc") — NaN.',
      'Number.isNaN() перевіряє результат надійніше, ніж глобальний isNaN().',
    ],
    tests: [
      { args: ['42'], expected: 42 },
      { args: ['3.5'], expected: 3.5 },
      { args: ['abc'], expected: 0 },
      { args: [''], expected: 0 },
      { args: ['   '], expected: 0 },
      { args: [null], expected: 0 },
      { args: [undefined], expected: 0 },
      { args: [17], expected: 17 },
    ],
  },
  {
    id: 'js-functions-counter',
    lessonId: 'js-functions',
    title: 'Лічильник на замиканні',
    difficulty: 'medium',
    description:
      'Напиши makeCounter(start), яка повертає функцію. Кожен її виклик збільшує лічильник на одиницю та повертає нове значення.',
    requirements: [
      'makeCounter повертає функцію, а не число.',
      'Стан лічильника зберігається між викликами.',
      'Два різні лічильники не впливають один на одного.',
      'Без аргументу лічильник стартує з 0.',
    ],
    exportName: 'makeCounter',
    starterCode: `function makeCounter(start = 0) {
  // Твій код тут
}`,
    hints: [
      'Оголоси змінну у зовнішній функції та зміни її у внутрішній.',
      'Внутрішня функція має повертати вже збільшене значення.',
    ],
    tests: [
      { name: 'перший виклик після makeCounter(0)', chain: [[]], args: [0], expected: 1 },
      { name: 'три виклики поспіль', chain: [[], [], []], args: [0], expected: 3 },
      { name: 'старт із 10', chain: [[]], args: [10], expected: 11 },
      { name: 'значення за замовчуванням', chain: [[], []], args: [], expected: 2 },
    ],
  },
  {
    id: 'js-functions-pipe',
    lessonId: 'js-functions',
    title: 'Композиція функцій',
    difficulty: 'hard',
    description:
      'Реалізуй pipe(...fns) — функцію вищого порядку, яка повертає нову функцію та застосовує передані функції зліва направо.',
    requirements: [
      'pipe(f, g)(x) дорівнює g(f(x)).',
      'Перша функція може приймати кілька аргументів.',
      'pipe() без аргументів повертає значення без змін.',
    ],
    exportName: 'pipe',
    starterCode: `function pipe(...fns) {
  // Твій код тут
}`,
    hints: [
      'Поверни функцію, яка приймає ...args.',
      'reduce чудово підходить: акумулятор — це поточне значення.',
      'Перший виклик відрізняється — він отримує всі аргументи.',
    ],
    rules: {
      forbidden: [
        { pattern: /\bfor\s*\(/, message: 'Спробуй обійтися без циклу for — використай reduce.' },
      ],
    },
    tests: [
      {
        name: 'дві функції',
        argsSource: ['(x) => x + 1', '(x) => x * 2'],
        chain: [[3]],
        expected: 8,
      },
      {
        name: 'три функції',
        argsSource: ['(x) => x * 2', '(x) => x + 10', '(x) => `сума: ${x}`'],
        chain: [[5]],
        expected: 'сума: 20',
      },
      {
        name: 'кілька аргументів у першу функцію',
        argsSource: ['(a, b) => a + b', '(x) => x ** 2'],
        chain: [[2, 3]],
        expected: 25,
      },
      { name: 'порожній pipe', argsSource: [], chain: [['як є']], expected: 'як є' },
    ],
  },
  {
    id: 'js-arrays-paid-total',
    lessonId: 'js-arrays',
    title: 'Сума оплачених замовлень',
    difficulty: 'medium',
    description:
      'Порахуй суму поля total для замовлень із paid: true. Використай ланцюжок методів масиву замість циклу.',
    requirements: [
      'Порожній масив дає 0.',
      'Неоплачені замовлення ігноруються.',
      'Вихідний масив не змінюється.',
    ],
    exportName: 'sumPaidOrders',
    starterCode: `function sumPaidOrders(orders) {
  // Твій код тут
}`,
    hints: [
      'filter відсіює непотрібне, reduce згортає решту в число.',
      'Не забудь початкове значення 0 у reduce — інакше порожній масив кине помилку.',
    ],
    rules: {
      required: [
        { pattern: /\.filter\s*\(/, message: 'Використай .filter() для відбору оплачених.' },
        { pattern: /\.reduce\s*\(/, message: 'Використай .reduce() для підсумовування.' },
      ],
      forbidden: [
        { pattern: /\bfor\s*\(|\bwhile\s*\(/, message: 'Цикли тут зайві — вистачить методів масиву.' },
      ],
    },
    tests: [
      {
        args: [
          [
            { id: 1, total: 120, paid: true },
            { id: 2, total: 80, paid: false },
            { id: 3, total: 260, paid: true },
          ],
        ],
        expected: 380,
      },
      { args: [[]], expected: 0 },
      { args: [[{ id: 1, total: 50, paid: false }]], expected: 0 },
      {
        args: [
          [
            { id: 1, total: 10.5, paid: true },
            { id: 2, total: 4.5, paid: true },
          ],
        ],
        expected: 15,
      },
    ],
  },
  {
    id: 'js-arrays-group-by',
    lessonId: 'js-arrays',
    title: 'Групування за ключем',
    difficulty: 'hard',
    description:
      'Напиши groupBy(items, key), яка згортає масив обʼєктів у обʼєкт: ключ — значення поля key, значення — масив елементів із цим значенням.',
    requirements: [
      'Порядок елементів усередині групи зберігається.',
      'Порожній масив дає порожній обʼєкт.',
      'Елементи без потрібного поля потрапляють у групу "undefined".',
    ],
    exportName: 'groupBy',
    starterCode: `function groupBy(items, key) {
  // Твій код тут
}`,
    hints: [
      'reduce з початковим значенням {} — природний вибір.',
      'Перед додаванням перевір, чи існує масив для цього ключа: acc[value] ?? [].',
    ],
    rules: {
      required: [{ pattern: /\.reduce\s*\(/, message: 'Розвʼяжи задачу через .reduce().' }],
    },
    tests: [
      {
        args: [
          [
            { name: 'Ada', role: 'dev' },
            { name: 'Linus', role: 'dev' },
            { name: 'Grace', role: 'ops' },
          ],
          'role',
        ],
        expected: {
          dev: [
            { name: 'Ada', role: 'dev' },
            { name: 'Linus', role: 'dev' },
          ],
          ops: [{ name: 'Grace', role: 'ops' }],
        },
      },
      { args: [[], 'role'], expected: {} },
      {
        args: [[{ id: 1, level: 2 }, { id: 2, level: 2 }], 'level'],
        expected: { 2: [{ id: 1, level: 2 }, { id: 2, level: 2 }] },
      },
    ],
  },
  {
    id: 'react-components-keys',
    lessonId: 'react-components',
    title: 'Стабільні ключі для списку',
    difficulty: 'easy',
    description:
      'Перед рендером списку треба отримати масив ключів. Використовуй item.id, а якщо його немає — запасний ключ на основі індексу.',
    requirements: [
      'Якщо в елемента є id, ключ — це рядкове представлення id.',
      'Якщо id відсутній, ключ має вигляд "item-<індекс>".',
      'Довжина результату збігається з довжиною вхідного масиву.',
    ],
    exportName: 'getListKeys',
    starterCode: `function getListKeys(items) {
  // Твій код тут
}`,
    hints: [
      'map отримує другим аргументом індекс елемента.',
      'String(item.id) перетворить числовий id на рядок.',
    ],
    rules: {
      required: [{ pattern: /\.map\s*\(/, message: 'Побудуй масив ключів через .map().' }],
    },
    tests: [
      {
        args: [[{ id: 'a' }, { title: 'без id' }, { id: 'c' }]],
        expected: ['a', 'item-1', 'c'],
      },
      { args: [[{ id: 7 }, { id: 8 }]], expected: ['7', '8'] },
      { args: [[]], expected: [] },
      { args: [[{}, {}]], expected: ['item-0', 'item-1'] },
    ],
  },
  {
    id: 'react-components-defaults',
    lessonId: 'react-components',
    title: 'Значення props за замовчуванням',
    difficulty: 'medium',
    description:
      'Напиши withDefaults(props), яка доповнює обʼєкт props значеннями за замовчуванням: title "Без назви", duration 0, level "beginner".',
    requirements: [
      'Передані значення мають пріоритет над замовчуваннями.',
      'Явно переданий undefined замінюється замовчуванням.',
      'Вхідний обʼєкт не мутується — повертається новий.',
      'Виклик без аргументів повертає повний набір замовчувань.',
    ],
    exportName: 'withDefaults',
    starterCode: `function withDefaults(props = {}) {
  // Твій код тут
}`,
    hints: [
      'Спред-оператор ставить пізніші значення поверх ранніх: { ...defaults, ...props }.',
      'Ключ зі значенням undefined усе одно перезапише замовчування — приберіть такі ключі або обробіть окремо.',
    ],
    rules: {
      required: [{ pattern: /\.\.\./, message: 'Скористайся спред-оператором для злиття обʼєктів.' }],
    },
    tests: [
      { args: [{}], expected: { title: 'Без назви', duration: 0, level: 'beginner' } },
      {
        args: [{ title: 'Масиви', duration: 18 }],
        expected: { title: 'Масиви', duration: 18, level: 'beginner' },
      },
      {
        args: [{ title: undefined, level: 'advanced' }],
        expected: { title: 'Без назви', duration: 0, level: 'advanced' },
      },
      { args: [], expected: { title: 'Без назви', duration: 0, level: 'beginner' } },
    ],
  },
  {
    id: 'react-state-reducer',
    lessonId: 'react-state',
    title: 'Оновлення стану без мутацій',
    difficulty: 'medium',
    description:
      'Реалізуй nextState(state, action) — чисту функцію оновлення стану лічильника. Вона завжди повертає новий обʼєкт.',
    requirements: [
      'increment збільшує count на 1, decrement — зменшує.',
      'reset повертає count до 0.',
      'Невідомий тип дії повертає стан із тими самими значеннями.',
      'Інші поля стану зберігаються.',
    ],
    exportName: 'nextState',
    starterCode: `function nextState(state, action) {
  // Твій код тут
}`,
    hints: [
      'switch за action.type читається краще за ланцюжок if.',
      'Кожна гілка має повертати { ...state, count: ... }.',
    ],
    rules: {
      required: [{ pattern: /\.\.\.state/, message: 'Копіюй стан через { ...state } замість мутації.' }],
      forbidden: [
        {
          pattern: /state\.\w+\s*(=[^=]|\+\+|--)/,
          message: 'Пряме присвоєння у state — це мутація. Поверни новий обʼєкт.',
        },
      ],
    },
    tests: [
      { args: [{ count: 0 }, { type: 'increment' }], expected: { count: 1 } },
      { args: [{ count: 5 }, { type: 'decrement' }], expected: { count: 4 } },
      { args: [{ count: 9, step: 1 }, { type: 'reset' }], expected: { count: 0, step: 1 } },
      {
        args: [{ count: 3, label: 'кліки' }, { type: 'unknown' }],
        expected: { count: 3, label: 'кліки' },
      },
    ],
  },
  {
    id: 'react-state-add-todo',
    lessonId: 'react-state',
    title: 'Додавання елемента в список',
    difficulty: 'medium',
    description:
      'Напиши addTodo(todos, text), яка повертає НОВИЙ масив із доданим завданням у кінці. Новий елемент має форму { id, text, done: false }.',
    requirements: [
      'id нового елемента — на одиницю більший за максимальний наявний.',
      'Для порожнього списку id дорівнює 1.',
      'Порожній або пробільний текст не додається — повертається копія списку.',
      'Вихідний масив не мутується.',
    ],
    exportName: 'addTodo',
    starterCode: `function addTodo(todos, text) {
  // Твій код тут
}`,
    hints: [
      'Math.max(...ids) на порожньому масиві дає -Infinity — обробіть цей випадок.',
      'text.trim() допоможе відсіяти пробільний ввід.',
    ],
    rules: {
      forbidden: [
        { pattern: /\.push\s*\(/, message: 'push мутує масив. Створи новий через спред.' },
      ],
    },
    tests: [
      {
        args: [[], 'Вивчити useEffect'],
        expected: [{ id: 1, text: 'Вивчити useEffect', done: false }],
      },
      {
        args: [[{ id: 1, text: 'Перше', done: true }], 'Друге'],
        expected: [
          { id: 1, text: 'Перше', done: true },
          { id: 2, text: 'Друге', done: false },
        ],
      },
      {
        args: [[{ id: 4, text: 'Готово', done: false }], 'Наступне'],
        expected: [
          { id: 4, text: 'Готово', done: false },
          { id: 5, text: 'Наступне', done: false },
        ],
      },
      { args: [[{ id: 1, text: 'Перше', done: false }], '   '], expected: [{ id: 1, text: 'Перше', done: false }] },
    ],
  },
  {
    id: 'react-effects-runs',
    lessonId: 'react-effects',
    title: 'Скільки разів спрацює ефект',
    difficulty: 'medium',
    description:
      'Отримавши масив знімків масиву залежностей по одному на кожен рендер, порахуй, скільки разів виконається тіло useEffect.',
    requirements: [
      'Перший рендер завжди запускає ефект.',
      'Наступний рендер запускає ефект лише тоді, коли хоча б одна залежність змінилася за Object.is.',
      'Порожній масив рендерів дає 0.',
    ],
    exportName: 'getEffectRuns',
    starterCode: `function getEffectRuns(depsPerRender) {
  // Твій код тут
}`,
    hints: [
      'Порівнюй поточний масив залежностей із попереднім поелементно.',
      'Object.is(NaN, NaN) дає true — саме тому React використовує його, а не ===.',
    ],
    tests: [
      { args: [[[1], [1], [2], [2], [3]]], expected: 3 },
      { args: [[[], [], []]], expected: 1 },
      { args: [[]], expected: 0 },
      { args: [[['a', 1], ['a', 1], ['a', 2]]], expected: 2 },
      { args: [[[0], [-0]]], expected: 2 },
    ],
  },
  {
    id: 'react-effects-lifecycle',
    lessonId: 'react-effects',
    title: 'Порядок setup і cleanup',
    difficulty: 'hard',
    description:
      'Поверни журнал життєвого циклу ефекту у вигляді масиву рядків "setup" та "cleanup" — так, як їх викликав би React для заданої послідовності залежностей.',
    requirements: [
      'Перед повторним запуском ефекту React викликає cleanup попереднього.',
      'Якщо залежності не змінилися, нічого не додається.',
      'Фінальний cleanup при розмонтуванні до журналу не входить.',
    ],
    exportName: 'runEffectLifecycle',
    starterCode: `function runEffectLifecycle(depsPerRender) {
  // Твій код тут
}`,
    hints: [
      'Журнал завжди починається з "setup", якщо є хоча б один рендер.',
      'На кожній зміні залежностей додаються два записи поспіль: "cleanup", потім "setup".',
    ],
    tests: [
      { args: [[[1]]], expected: ['setup'] },
      { args: [[[1], [1]]], expected: ['setup'] },
      { args: [[[1], [2]]], expected: ['setup', 'cleanup', 'setup'] },
      {
        args: [[[1], [2], [2], [3]]],
        expected: ['setup', 'cleanup', 'setup', 'cleanup', 'setup'],
      },
      { args: [[]], expected: [] },
    ],
  },
];

export const tasksById = Object.fromEntries(tasks.map((task) => [task.id, task]));

export function getTasksForLesson(lessonId) {
  return tasks.filter((task) => task.lessonId === lessonId);
}

export function getTaskById(id) {
  return tasksById[id] ?? null;
}

export const totalTaskPoints = tasks.reduce(
  (sum, task) => sum + DIFFICULTIES[task.difficulty].points,
  0,
);
