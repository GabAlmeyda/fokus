import type { JSX } from 'react';
import styles from './LoadingOverlay.module.css';

interface LoadingOverlayProps {
  message: string;
}

export default function LoadingOverlay({
  message,
}: LoadingOverlayProps): JSX.Element {
  return (
    <>
      <div className={styles.loadingOverlay} aria-live="assertive">
        <p>{message}</p>
        <div className={styles.loadingOverlay__spinner}></div>
      </div>
      <div className={styles._backdrop}></div>
    </>
  );
}
