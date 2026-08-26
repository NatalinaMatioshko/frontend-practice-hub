/**
 * Each achievement reports its own progress so the UI can render partially
 * earned badges instead of a plain locked/unlocked toggle.
 */
export const achievements = [
  {
    id: 'first-step',
    title: 'Перший крок',
    description: 'Розвʼязати першу задачу',
    icon: 'spark',
    measure: (stats) => ({ current: stats.solvedTasks, target: 1 }),
  },
  {
    id: 'explorer',
    title: 'Дослідник',
    description: 'Відкрити всі уроки',
    icon: 'compass',
    measure: (stats) => ({ current: stats.viewedLessons, target: stats.totalLessons }),
  },
  {
    id: 'js-adept',
    title: 'JS-адепт',
    description: 'Завершити всі уроки JavaScript',
    icon: 'js',
    measure: (stats) => ({
      current: stats.byTrack.javascript.completed,
      target: stats.byTrack.javascript.total,
    }),
  },
  {
    id: 'react-adept',
    title: 'React-адепт',
    description: 'Завершити всі уроки React',
    icon: 'react',
    measure: (stats) => ({
      current: stats.byTrack.react.completed,
      target: stats.byTrack.react.total,
    }),
  },
  {
    id: 'halfway',
    title: 'Половина шляху',
    description: 'Завершити половину всіх уроків',
    icon: 'flag',
    measure: (stats) => ({
      current: stats.completedLessons,
      target: Math.ceil(stats.totalLessons / 2),
    }),
  },
  {
    id: 'hard-mode',
    title: 'Складний рівень',
    description: 'Розвʼязати дві складні задачі',
    icon: 'fire',
    measure: (stats) => ({ current: stats.solvedHardTasks, target: 2 }),
  },
  {
    id: 'streak-3',
    title: 'Три дні поспіль',
    description: 'Практикуватися три дні без перерви',
    icon: 'calendar',
    measure: (stats) => ({ current: stats.streak, target: 3 }),
  },
  {
    id: 'completionist',
    title: 'Перфекціоніст',
    description: 'Розвʼязати всі задачі курсу',
    icon: 'trophy',
    measure: (stats) => ({ current: stats.solvedTasks, target: stats.totalTasks }),
  },
];

export function evaluateAchievements(stats) {
  return achievements.map((achievement) => {
    const { current, target } = achievement.measure(stats);
    const safeTarget = Math.max(target, 1);
    const clamped = Math.min(current, safeTarget);

    return {
      ...achievement,
      current: clamped,
      target: safeTarget,
      percent: Math.round((clamped / safeTarget) * 100),
      earned: clamped >= safeTarget,
    };
  });
}
