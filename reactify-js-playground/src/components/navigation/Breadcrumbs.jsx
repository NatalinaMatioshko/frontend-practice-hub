import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label="Навігаційний ланцюжок">
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className={styles.item}>
                {item.to && !isLast ? (
                  <Link to={item.to} className={styles.link}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li className={styles.separator} aria-hidden="true">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
