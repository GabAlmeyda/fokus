import type { JSX } from 'react';
import styles from './FormErrorMessage.module.css';

interface FormErrorMessageProps {
  message?: string;
}

export default function FormErrorMessage({
  message='Campo inválido',
}: FormErrorMessageProps): JSX.Element {
  return <span className={styles.form__error}>{message}</span>;
}
