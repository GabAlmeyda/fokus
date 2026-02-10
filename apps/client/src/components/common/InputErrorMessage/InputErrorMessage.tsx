import type { JSX } from 'react';
import styles from './InputErrorMessage.module.css';

interface InputErrorMessageProps {
  message?: string;
}

export default function InputErrorMessage({
  message='Campo inválido',
}: InputErrorMessageProps): JSX.Element {
  return <span className={styles.input__error}>{message}</span>;
}
