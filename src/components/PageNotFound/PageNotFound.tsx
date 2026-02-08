import React from 'react';
import styles from './PageNotFound.module.scss';
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

export const PageNotFound: React.FC = React.memo(() => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404</h1>
        <h2>Seite nicht gefunden</h2>
        <p>Die angeforderte Seite existiert nicht.</p>
        <Link to="/" className={styles.link}>
          <BiArrowBack size={20} />
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
});

export default PageNotFound;