import { useEffect, useRef, useState, type JSX } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  message: string;
  bgColor: string;
  ariaLive?: 'assertive' | 'polite';
  className?: string;
}

export default function Toast({
  message,
  bgColor,
  ariaLive = 'polite',
  className,
}: ToastProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toastRef.current) return;
    const timerId = setTimeout(() => setIsOpen(false), 5000);
    const callback = () => {
      setIsOpen(false);
    }

    toastRef.current.addEventListener('click', callback);

    return () => {
      clearTimeout(timerId);
      toastRef.current?.removeEventListener('click', callback);
    }
  }, [])

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
