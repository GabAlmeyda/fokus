import type { JSX } from 'react';
import styles from './Main.module.css';

interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps): JSX.Element {
  return <main className={`${styles.main}`}>{children}</main>;
}
