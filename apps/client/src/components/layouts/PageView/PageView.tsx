import type { JSX } from 'react';
import styles from './PageView.module.css';
import type React from 'react';
import Footer from '../Footer/Footer';

interface PageViewProps {
  bgType?: 'primary' | 'secondary' | 'muted' | 'inverse';
  children: React.ReactNode;
}

export default function PageView({ bgType='primary', children }: PageViewProps): JSX.Element {
  return (
    <div className={`${styles.pageView} ${styles[bgType]}`}>
      {children}
      <Footer />
    </div>
  );
}
