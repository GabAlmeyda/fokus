import { useEffect, type HTMLAttributes, type JSX } from 'react';
import styles from './PageView.module.css';
import type React from 'react';

interface PageViewProps extends HTMLAttributes<HTMLDivElement> {
  cssBgType?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'none';
  customBgColor?: string;
  children: React.ReactNode;
}

export default function PageView({
  cssBgType = 'none',
  customBgColor,
  children,
  ...props
}: PageViewProps): JSX.Element {
  const finalBg =
    customBgColor || (cssBgType !== 'none' ? `var(--bg-${cssBgType})` : '');

  useEffect(() => {
    if (!finalBg) return;

    document.documentElement.style.backgroundColor = finalBg;
    document.body.style.backgroundColor = finalBg;

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [finalBg]);

  return (
    <div
      className={`${styles.pageView} ${props['className']}`}
      style={{ backgroundColor: finalBg }}
    >
      {children}
    </div>
  );
}
