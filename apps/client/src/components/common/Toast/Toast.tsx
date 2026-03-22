import { useEffect, useRef, type JSX } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  isOpen: boolean;
  onClick: (state: boolean) => void;
  message: string;
  bgColor: string;
  ariaLive?: 'assertive' | 'polite';
  className?: string;
}

export default function Toast({
  isOpen,
  onClick,
  message,
  bgColor,
  ariaLive = 'polite',
  className,
}: ToastProps): JSX.Element {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toastRef.current) return;
    const callback = () => {
      onClick(false);
    };
    toastRef.current.addEventListener('click', callback);

    return () => {
      toastRef.current?.removeEventListener('click', callback);
    };
  }, []);

  return (
    <div
      className={`${styles.toast} ${className} ${isOpen ? styles.toast_open : ''}`}
      style={{ backgroundColor: bgColor }}
      aria-live={ariaLive}
      ref={toastRef}
    >
      <p>{message}</p>
    </div>
  );
}
