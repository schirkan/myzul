import styles from './Header.module.scss';
import githubIcon from 'assets/github.svg';
import { Logo } from 'components/Logo';
import { Link } from 'react-router-dom';
import { TbColorFilter } from "react-icons/tb";

export const Header = () => {
  return (
    <header className={styles.container}>
      <label htmlFor="theme-selection-shower" className={styles.themeIcon} title='Theme'>
        <TbColorFilter size={40} color='#000' />
      </label>
      <Link to="/" onClick={(e) => {
        if (!window.confirm('Möchten Sie wirklich zur Startseite zurückkehren? Alle nicht gespeicherten Daten gehen verloren.')) {
          e.preventDefault();
        }
      }}>
        <Logo />
      </Link>
      <a href="https://github.com/schirkan/myzul-server" target="_blank" rel="noreferrer" className={styles.githubIcon}>
        <img alt="github" title="View on GitHub" src={githubIcon} />
      </a>
    </header>
  );
};

export default Header;
