---
to: <%= absPath %>/<%= component_name %>.tsx
---
import React from 'react';
import styles from './<%= component_name %>.module.scss';

type Props = {};

export const <%= component_name %>: React.FC<Props> = React.memo((props) => {
  return <div className={styles.container}>
    Hello World
  </div>;
});