import type { JSX } from 'react';
import { FaLeaf } from "react-icons/fa";
import styles from './Navbar.module.css';
import Button from '../../common/Button/Button';

export default function Navbar(): JSX.Element {
  return <nav className={styles.navbar}>
    <div className={styles.navbar__logo}>
      <FaLeaf className={styles.logo__icon}/>
      <p className={styles.logo__name}>Fokus</p>
    </div>

    <div className={styles.navbar__btns}>
      <Button variant='ghost-primary'>Conecte-se</Button>
      <Button>Cadastre-se</Button>
    </div>
  </nav>;
}
