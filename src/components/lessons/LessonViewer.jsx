import { useState } from 'react';
import { Icon } from '../ui/Icon.jsx';
import { RichText } from './RichText.jsx';
import styles from './LessonViewer.module.css';

const CALLOUT_ICON = { info: 'info', warning: 'info', success: 'check' };

export function LessonViewer({ blocks = [] }) {
  return (
    <article className={styles.viewer}>
      {blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </article>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return <RichText as="h3" className={styles.heading} text={block.text} />;

    case 'paragraph':
      return <RichText as="p" className={styles.paragraph} text={block.text} />;

    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item, index) => (
            <li key={index}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      );

    case 'code':
      return <CodeBlock caption={block.caption} code={block.code} />;

    case 'callout':
      return (
        <aside className={`${styles.callout} ${styles[block.tone ?? 'info']}`}>
          <Icon name={CALLOUT_ICON[block.tone] ?? 'info'} size={18} />
          <div>
            <p className={styles.calloutTitle}>{block.title}</p>
            <RichText as="p" className={styles.calloutText} text={block.text} />
          </div>
        </aside>
      );

    default:
      return null;
  }
}

function CodeBlock({ caption, code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure className={styles.codeBlock}>
      <figcaption className={styles.codeHead}>
        <span>{caption ?? 'Приклад'}</span>
        <button type="button" className={styles.copy} onClick={copy}>
          <Icon name={copied ? 'check' : 'code'} size={14} />
          {copied ? 'Скопійовано' : 'Копіювати'}
        </button>
      </figcaption>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export default LessonViewer;
