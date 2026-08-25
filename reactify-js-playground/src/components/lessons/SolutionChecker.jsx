import { useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Modal } from '../ui/Modal.jsx';
import { getSolution } from '../../data/solutions.js';
import { useProgress } from '../../hooks/useProgress.js';
import styles from './SolutionChecker.module.css';

const BANNERS = {
  passed: { tone: 'success', icon: 'check', title: 'Усі тести пройдено!' },
  failed: { tone: 'danger', icon: 'cross', title: 'Ще не все сходиться' },
  error: { tone: 'danger', icon: 'cross', title: 'Помилка виконання' },
  invalid: { tone: 'warning', icon: 'info', title: 'Код не відповідає умові' },
  timeout: { tone: 'warning', icon: 'info', title: 'Занадто довге виконання' },
};

export function SolutionChecker({ task, result, isRunning, onLoadSolution }) {
  const { revealSolution } = useProgress();
  const [hintIndex, setHintIndex] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const solution = getSolution(task.id);
  const banner = result ? BANNERS[result.status] : null;

  const openSolution = () => {
    revealSolution(task.id);
    setShowSolution(true);
  };

  return (
    <div className={styles.checker}>
      {isRunning && (
        <p className={styles.running} role="status">
          Виконуємо код у пісочниці…
        </p>
      )}

      {!isRunning && banner && (
        <div className={`${styles.banner} ${styles[banner.tone]}`} role="status">
          <Icon name={banner.icon} size={18} />
          <div>
            <strong>{banner.title}</strong>
            {result.status === 'passed' && (
              <p>
                Тестів пройдено: {result.passedCount} із {result.totalCount}. Прогрес збережено.
              </p>
            )}
            {result.status === 'failed' && (
              <p>
                Пройдено {result.passedCount} із {result.totalCount}. Подивись, що повертає код у
                провалених випадках.
              </p>
            )}
            {(result.status === 'error' || result.status === 'timeout') && <p>{result.error}</p>}
            {result.status === 'invalid' && (
              <ul className={styles.issues}>
                {result.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {!isRunning && result?.results?.length > 0 && (
        <ol className={styles.tests}>
          {result.results.map((test, index) => (
            <li key={index} className={`${styles.test} ${test.passed ? styles.pass : styles.fail}`}>
              <div className={styles.testHead}>
                <span className={styles.status} aria-hidden="true">
                  <Icon name={test.passed ? 'check' : 'cross'} size={13} />
                </span>
                <code className={styles.call}>{test.call}</code>
                <span className={styles.testLabel}>{test.passed ? 'ok' : 'провалено'}</span>
              </div>

              {!test.passed && (
                <dl className={styles.diff}>
                  <div>
                    <dt>Очікується</dt>
                    <dd>
                      <code>{test.expected}</code>
                    </dd>
                  </div>
                  <div>
                    <dt>Отримано</dt>
                    <dd>
                      <code>{test.error ?? test.actual}</code>
                    </dd>
                  </div>
                </dl>
              )}
            </li>
          ))}
        </ol>
      )}

      {!isRunning && result?.logs?.length > 0 && (
        <div className={styles.console}>
          <p className={styles.consoleTitle}>console.log</p>
          <pre className={styles.consoleBody}>{result.logs.join('\n')}</pre>
        </div>
      )}

      <div className={styles.help}>
        {task.hints?.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Icon name="bulb" size={16} />}
            onClick={() => {
              setShowHints(true);
              setHintIndex((index) => Math.min(index + 1, task.hints.length));
            }}
            disabled={showHints && hintIndex >= task.hints.length}
          >
            {showHints ? 'Ще підказку' : 'Підказка'}
          </Button>
        )}

        {solution && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<Icon name="eye" size={16} />}
            onClick={openSolution}
          >
            Показати рішення
          </Button>
        )}
      </div>

      {showHints && hintIndex > 0 && (
        <ul className={styles.hints}>
          {task.hints.slice(0, hintIndex).map((hint, index) => (
            <li key={hint}>
              <span className={styles.hintNumber}>{index + 1}</span>
              {hint}
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={showSolution}
        onClose={() => setShowSolution(false)}
        title="Еталонне рішення"
        description={task.title}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowSolution(false)}>
              Закрити
            </Button>
            <Button
              onClick={() => {
                onLoadSolution?.(solution.code);
                setShowSolution(false);
              }}
            >
              Вставити в редактор
            </Button>
          </>
        }
      >
        {solution && (
          <>
            <pre className={styles.solutionCode}>
              <code>{solution.code}</code>
            </pre>
            <p className={styles.explanation}>{solution.explanation}</p>
          </>
        )}
      </Modal>
    </div>
  );
}

export default SolutionChecker;
