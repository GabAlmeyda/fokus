import type { JSX } from 'react';

import styles from './Footer.module.css';

interface FooterProps {
  customBgColor?: string;
  className?: string;
}

export default function Footer({
  className = '',
  customBgColor = '',
}: FooterProps): JSX.Element {
  return (
    <footer
      className={`${styles.footer} ${className}`}
      style={{ backgroundColor: customBgColor }}
    >
      <p>
        <small>
          &copy;Fokus {new Date().getFullYear()}. Todos os direitos reservados.
        </small>
      </p>
    </footer>
  );
}
