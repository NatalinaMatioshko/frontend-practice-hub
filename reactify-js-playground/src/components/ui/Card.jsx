import styles from './Card.module.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function Card({
  as: Component = 'div',
  interactive = false,
  padding = 'md',
  className,
  children,
  ...rest
}) {
  return (
    <Component
      className={cx(styles.card, styles[padding], interactive && styles.interactive, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ className, children, ...rest }) {
  return (
    <header className={cx(styles.header, className)} {...rest}>
      {children}
    </header>
  );
}

export function CardFooter({ className, children, ...rest }) {
  return (
    <footer className={cx(styles.footer, className)} {...rest}>
      {children}
    </footer>
  );
}

export default Card;
