import type { HTMLAttributes, JSX } from 'react';

import styles from './Footer.module.css';

interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  customBgColor?: string;
}

export default function Footer({
  customBgColor = '',
  ...props
}: FooterProps): JSX.Element {
  return (
    <footer
      className={`${styles.footer} ${props['className']}`}
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
