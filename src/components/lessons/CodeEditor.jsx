import { useCallback, useId, useMemo, useRef } from 'react';
import styles from './CodeEditor.module.css';

const INDENT = '  ';

export function CodeEditor({ value, onChange, onRun, readOnly = false, minRows = 10, label }) {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);
  const id = useId();

  const lineCount = useMemo(() => Math.max(value.split('\n').length, minRows), [value, minRows]);

  const syncScroll = useCallback((event) => {
    if (gutterRef.current) gutterRef.current.scrollTop = event.currentTarget.scrollTop;
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        onRun?.();
        return;
      }

      if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;

      event.preventDefault();
      const textarea = event.currentTarget;
      const { selectionStart, selectionEnd } = textarea;

      if (event.shiftKey) {
        const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
        if (value.startsWith(INDENT, lineStart)) {
          const next = value.slice(0, lineStart) + value.slice(lineStart + INDENT.length);
          onChange(next);
          queueCaret(textarea, Math.max(lineStart, selectionStart - INDENT.length));
        }
        return;
      }

      const next = value.slice(0, selectionStart) + INDENT + value.slice(selectionEnd);
      onChange(next);
      queueCaret(textarea, selectionStart + INDENT.length);
    },
    [onChange, onRun, value],
  );

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <label htmlFor={id} className={styles.filename}>
          {label ?? 'solution.js'}
        </label>
        <span className={styles.hint}>Ctrl + Enter — запустити</span>
      </div>

      <div className={styles.surface} style={{ '--editor-rows': lineCount }}>
        <div className={styles.gutter} ref={gutterRef} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => (
            <span key={index}>{index + 1}</span>
          ))}
        </div>

        <textarea
          id={id}
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          readOnly={readOnly}
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
          autoComplete="off"
          wrap="off"
        />
      </div>
    </div>
  );
}

function queueCaret(textarea, position) {
  requestAnimationFrame(() => {
    textarea.selectionStart = position;
    textarea.selectionEnd = position;
  });
}

export default CodeEditor;
