import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';
import styles from './Modal.module.css';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, description, footer, size = 'md', children }) {
  const dialogRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;

    restoreFocusRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      const target = dialogRef.current?.querySelector(FOCUSABLE) ?? dialogRef.current;
      target?.focus();
    }, 0);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Закрити">
            <Icon name="cross" size={18} />
          </button>
        </header>

        <div className={styles.body}>{children}</div>

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
