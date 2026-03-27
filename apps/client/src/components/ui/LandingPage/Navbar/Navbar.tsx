import type { JSX } from 'react';
import { FaLeaf } from 'react-icons/fa';
import styles from './Navbar.module.css';
import Button from '../../../common/Button/Button';
import { APP_URLS } from '../../../../helpers/app.helpers';

export default function Navbar(): JSX.Element {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar__logo}>
        <FaLeaf className={styles.logo__icon} />
        <p className={styles.logo__name}>Fokus</p>
      </div>

      <div className={styles.navbar__btns}>
        <Button variant="ghost-primary" isLink to={APP_URLS.login}>
          Conecte-se
        </Button>
        <Button isLink to={APP_URLS.register}>
          Cadastre-se
        </Button>
      </div>
    </nav>
  );
}
