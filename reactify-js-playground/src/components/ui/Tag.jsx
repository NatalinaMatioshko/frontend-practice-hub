import styles from './Tag.module.css';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export function Tag({ tone = 'neutral', icon = null, className, children, ...rest }) {
  return (
    <span className={cx(styles.tag, styles[tone], className)} {...rest}>
      {icon}
      {children}
    </span>
  );
}

export default Tag;
