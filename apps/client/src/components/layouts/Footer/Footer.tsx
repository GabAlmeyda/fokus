import type { JSX } from "react";

import styles from './Footer.module.css';

export default function Footer(): JSX.Element {
  return <footer className={styles.footer}>
    <p><small>&copy;Fokus 2025. Todos os direitos reservados.</small></p>
  </footer>
}