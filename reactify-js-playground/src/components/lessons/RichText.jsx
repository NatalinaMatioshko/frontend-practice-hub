import { Fragment } from 'react';
import styles from './RichText.module.css';

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*)/g;

/**
 * Minimal inline formatting for lesson copy: `code` and **bold**.
 * Deliberately not a full markdown parser — lesson data stays plain and safe.
 */
export function RichText({ text, as: Component = 'span', className }) {
  const parts = String(text).split(TOKEN).filter(Boolean);

  return (
    <Component className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code key={index} className={styles.code}>
              {part.slice(1, -1)}
            </code>
          );
        }

        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        return <Fragment key={index}>{part}</Fragment>;
      })}
    </Component>
  );
}

export default RichText;
