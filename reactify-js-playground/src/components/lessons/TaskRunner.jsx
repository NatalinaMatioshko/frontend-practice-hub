import { useCallback } from 'react';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Tag } from '../ui/Tag.jsx';
import { CodeEditor } from './CodeEditor.jsx';
import { SolutionChecker } from './SolutionChecker.jsx';
import { DIFFICULTIES } from '../../data/tasks.js';
import { useCodeEditor } from '../../hooks/useCodeEditor.js';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './TaskRunner.module.css';

const DIFFICULTY_TONE = { easy: 'success', medium: 'warning', hard: 'danger' };

export function TaskRunner({ task, index }) {
  const { progress, registerAttempt } = useProgress();
  const taskState = progress.tasks[task.id];
  const isSolved = Boolean(taskState?.solvedAt);

  const handleResult = useCallback(
    (outcome) => registerAttempt(task.id, outcome.status === 'passed'),
    [registerAttempt, task.id],
  );

  const { code, setCode, result, isRunning, run, resetCode, loadCode } = useCodeEditor(task, {
    onResult: handleResult,
  });

  const difficulty = DIFFICULTIES[task.difficulty];

  return (
    <section className={`${styles.task} ${isSolved ? styles.solved : ''}`} id={`task-${task.id}`}>
      <header className={styles.header}>
        <div className={styles.headline}>
          {index != null && <span className={styles.index}>Задача {index}</span>}
          <h3 className={styles.title}>{task.title}</h3>
        </div>

        <div className={styles.tags}>
          <Tag tone={DIFFICULTY_TONE[task.difficulty]}>{difficulty.label}</Tag>
          <Tag tone="brand">+{difficulty.points} балів</Tag>
          {isSolved && (
            <Tag tone="success" icon={<Icon name="check" size={13} />}>
              Розвʼязано
            </Tag>
          )}
        </div>
      </header>

      <p className={styles.description}>{task.description}</p>

      {task.requirements?.length > 0 && (
        <ul className={styles.requirements}>
          {task.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
      )}

      <CodeEditor value={code} onChange={setCode} onRun={run} label={`${task.exportName}.js`} />

      <div className={styles.controls}>
        <Button onClick={run} loading={isRunning} iconLeft={<Icon name="play" size={15} />}>
          Перевірити рішення
        </Button>
        <Button
          variant="secondary"
          onClick={resetCode}
          iconLeft={<Icon name="reset" size={15} />}
          disabled={isRunning}
        >
          Скинути код
        </Button>
        {taskState?.attempts > 0 && (
          <span className={styles.attempts}>Спроб: {taskState.attempts}</span>
        )}
      </div>

      <SolutionChecker
        task={task}
        result={result}
        isRunning={isRunning}
        onLoadSolution={loadCode}
      />
    </section>
  );
}

export default TaskRunner;
