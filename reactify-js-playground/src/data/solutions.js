export const solutions = {
  'js-variables-describe': {
    code: `function describeValue(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}`,
    explanation:
      'Порядок перевірок важливий: null і масиви обидва дають typeof "object", тому їх відсіюємо до звичайного typeof.',
  },
  'js-variables-parse-score': {
    code: `function parseScore(input) {
  if (typeof input === 'string' && input.trim() === '') return 0;
  const parsed = Number(input);
  return Number.isNaN(parsed) ? 0 : parsed;
}`,
    explanation:
      'Number("") і Number("   ") дають 0 самі по собі, але Number(null) теж 0, а Number(undefined) — NaN. Явна перевірка порожнього рядка робить намір очевидним, а Number.isNaN ловить решту випадків.',
  },
  'js-functions-counter': {
    code: `function makeCounter(start = 0) {
  let value = start;
  return () => ++value;
}`,
    explanation:
      'Змінна value живе у скоупі makeCounter. Повернена стрілочна функція замикається на ній, тому кожен лічильник має власний незалежний стан.',
  },
  'js-functions-pipe': {
    code: `function pipe(...fns) {
  return (...args) => fns.reduce((value, fn, index) => (index === 0 ? fn(...args) : fn(value)), args[0]);
}`,
    explanation:
      'Перша функція отримує всі аргументи, далі кожна наступна працює з одним значенням — результатом попередньої. Початкове значення args[0] покриває випадок порожнього pipe.',
  },
  'js-arrays-paid-total': {
    code: `function sumPaidOrders(orders) {
  return orders
    .filter((order) => order.paid)
    .reduce((sum, order) => sum + order.total, 0);
}`,
    explanation:
      'filter і reduce повертають нові значення й не чіпають вихідний масив. Початкове значення 0 гарантує коректний результат для порожнього масиву.',
  },
  'js-arrays-group-by': {
    code: `function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const group = item[key];
    acc[group] = [...(acc[group] ?? []), item];
    return acc;
  }, {});
}`,
    explanation:
      'Акумулятор — обʼєкт груп. Оператор ?? створює масив під час першої зустрічі ключа, тож окрема ініціалізація не потрібна.',
  },
  'react-components-keys': {
    code: `function getListKeys(items) {
  return items.map((item, index) => (item.id === undefined ? \`item-\${index}\` : String(item.id)));
}`,
    explanation:
      'Ключ має бути стабільним рядком. Індекс використовуємо лише як запасний варіант — саме тому список зі змінним порядком краще завжди мати з id.',
  },
  'react-components-defaults': {
    code: `function withDefaults(props = {}) {
  const defaults = { title: 'Без назви', duration: 0, level: 'beginner' };
  const provided = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  );
  return { ...defaults, ...provided };
}`,
    explanation:
      'Просте { ...defaults, ...props } зламалося б на явному undefined: такий ключ перезаписав би замовчування. Тому спершу відсіюємо undefined-значення.',
  },
  'react-state-reducer': {
    code: `function nextState(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'reset':
      return { ...state, count: 0 };
    default:
      return { ...state };
  }
}`,
    explanation:
      'Кожна гілка створює новий обʼєкт, тому React бачить зміну за посиланням. Гілка default повертає копію — стан лишається логічно тим самим.',
  },
  'react-state-add-todo': {
    code: `function addTodo(todos, text) {
  const trimmed = text.trim();
  if (!trimmed) return [...todos];

  const nextId = todos.length === 0 ? 1 : Math.max(...todos.map((todo) => todo.id)) + 1;
  return [...todos, { id: nextId, text: trimmed, done: false }];
}`,
    explanation:
      'Спред створює новий масив, тому вихідний стан лишається недоторканим. Math.max зі спредом потребує окремої обробки порожнього списку — інакше отримаємо -Infinity.',
  },
  'react-effects-runs': {
    code: `function getEffectRuns(depsPerRender) {
  let runs = 0;
  let previous = null;

  for (const deps of depsPerRender) {
    const changed =
      previous === null ||
      deps.length !== previous.length ||
      deps.some((dep, index) => !Object.is(dep, previous[index]));

    if (changed) runs += 1;
    previous = deps;
  }

  return runs;
}`,
    explanation:
      'React порівнює залежності поверхнево через Object.is. Саме тому новий обʼєкт або масив у залежностях перезапускає ефект на кожному рендері, навіть якщо вміст однаковий.',
  },
  'react-effects-lifecycle': {
    code: `function runEffectLifecycle(depsPerRender) {
  const log = [];
  let previous = null;

  for (const deps of depsPerRender) {
    if (previous === null) {
      log.push('setup');
    } else if (deps.some((dep, index) => !Object.is(dep, previous[index]))) {
      log.push('cleanup', 'setup');
    }
    previous = deps;
  }

  return log;
}`,
    explanation:
      'React завжди прибирає за попереднім ефектом перед запуском нового. Це гарантує, що підписка чи таймер із застарілими значеннями не залишиться активним.',
  },
};

export function getSolution(taskId) {
  return solutions[taskId] ?? null;
}
