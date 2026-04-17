import type { HTMLAttributes, JSX } from 'react';

import styles from './Footer.module.css';

interface FooterProps extends HTMLAttributes<HTMLDivElement> {
  customBgColor?: string;
  className?: string;
}

export default function Footer({
  customBgColor = '',
  className = '',
  ...props
}: FooterProps): JSX.Element {
  return (
    <footer
      className={`${styles.footer} ${className} ${props}`}
      style={{ backgroundColor: customBgColor }}
    >
      <p>
        <small>
          &copy;Fokus. Site feito por{' '}
          <a href="https://gabalmeyda.vercel.app" target="_blank">
            Gabriel Almeida
          </a>
          .
        </small>
      </p>
    </footer>
  );
}
