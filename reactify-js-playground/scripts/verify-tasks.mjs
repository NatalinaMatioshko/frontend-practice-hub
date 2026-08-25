/**
 * Content check for the lesson data: every reference solution must satisfy its
 * own task rules and pass every test, and every starter template must fail.
 * Run with `npm run verify`.
 */
import { tasks } from '../src/data/tasks.js';
import { solutions } from '../src/data/solutions.js';
import { lessonsById } from '../src/data/lessons.js';
import { runTests } from '../src/utils/runnerCore.js';
import { validateCode } from '../src/utils/codeValidator.js';

let failures = 0;

const fail = (taskId, message) => {
  failures += 1;
  console.error(`  ✗ ${taskId}: ${message}`);
};

for (const task of tasks) {
  if (!lessonsById[task.lessonId]) {
    fail(task.id, `посилається на неіснуючий урок "${task.lessonId}"`);
  }

  if (!task.tests?.length) {
    fail(task.id, 'не має жодного тесту');
  }

  const solution = solutions[task.id];
  if (!solution) {
    fail(task.id, 'не має еталонного рішення');
    continue;
  }

  const validation = validateCode(solution.code, task.rules);
  if (!validation.valid) {
    fail(task.id, `еталон не проходить правила: ${validation.issues.join('; ')}`);
    continue;
  }

  const outcome = runTests(solution.code, task);
  if (outcome.status !== 'passed') {
    const details =
      outcome.error ??
      outcome.results
        .filter((result) => !result.passed)
        .map((result) => `${result.call} → ${result.error ?? result.actual} (очікується ${result.expected})`)
        .join('; ');
    fail(task.id, `еталон не проходить тести: ${details}`);
    continue;
  }

  const starterOutcome = runTests(task.starterCode, task);
  if (starterOutcome.status === 'passed') {
    fail(task.id, 'шаблон проходить тести — задача нічого не перевіряє');
    continue;
  }

  console.log(`  ✓ ${task.id} (${outcome.results.length} тестів)`);
}

if (failures > 0) {
  console.error(`\nЗнайдено проблем: ${failures}`);
  process.exit(1);
}

console.log(`\nУсі ${tasks.length} задач перевірено успішно.`);
