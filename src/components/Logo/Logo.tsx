import React from 'react';
import styles from './Logo.module.scss';

export const Logo: React.FC = React.memo(() => {
  return <div className={styles.container}>
    <span className={styles.letterA}>A</span>
    <span className={styles.letterZ}>Z</span>
    <span className={styles.letterU}>U</span>
    <span className={styles.letterL}>L</span>
  </div>
});