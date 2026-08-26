import styles from './Button.module.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  iconLeft = null,
  iconRight = null,
  className,
  children,
  disabled,
  ...rest
}) {
  const isNativeButton = Component === 'button';

  return (
    <Component
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className,
      )}
      disabled={isNativeButton ? disabled || loading : undefined}
      aria-disabled={!isNativeButton && (disabled || loading) ? true : undefined}
      aria-busy={loading || undefined}
      type={isNativeButton ? (rest.type ?? 'button') : rest.type}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {iconLeft}
      <span className={styles.label}>{children}</span>
      {iconRight}
    </Component>
  );
}

export default Button;
