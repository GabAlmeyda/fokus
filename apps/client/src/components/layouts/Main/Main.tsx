import type { JSX } from 'react';
import styles from './Main.module.css';

interface MainProps {
  className?: string;
  children: React.ReactNode;
}

export default function Main({ className='', children }: MainProps): JSX.Element {
  return (
    <main className={`${styles.main} ${className}`}>
      {children}
    </main>
  );
}
