import type { JSX } from 'react';
import styles from './FormErrorMessage.module.css';

interface FormErrorMessageProps {
  id: string;
  isHidden: boolean;
  message?: string;
}

export default function FormErrorMessage({
  id,
  isHidden,
  message = 'Campo inválido',
}: FormErrorMessageProps): JSX.Element {
  return (
    <span
      style={{ display: isHidden ? 'none' : 'block' }}
      aria-hidden={isHidden}
      id={id}
      className={styles.form__error}
      aria-atomic="true"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </span>
  );
}
