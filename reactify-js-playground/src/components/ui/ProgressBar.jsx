import styles from './ProgressBar.module.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  hint,
  size = 'md',
  tone = 'brand',
  showValue = true,
  className,
}) {
  const safeMax = max > 0 ? max : 100;
  const percent = Math.min(100, Math.max(0, Math.round((value / safeMax) * 100)));

  return (
    <div className={cx(styles.wrapper, className)}>
      {(label || showValue) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{hint ?? `${percent}%`}</span>}
        </div>
      )}
      <div
        className={cx(styles.track, styles[size])}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Прогрес'}
      >
        <div className={cx(styles.fill, styles[tone])} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default ProgressBar;
