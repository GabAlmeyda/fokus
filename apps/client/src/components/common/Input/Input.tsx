import type { InputHTMLAttributes, JSX } from 'react';
import { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'number' | 'email' | 'password';
  hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', hasError = false, ...props }: InputProps, ref): JSX.Element => {
    return (
      <input
        type={type}
        {...props}
        className={`${styles.input} ${hasError ? styles.input_error : ''}`}
        ref={ref}
      />
    );
  },
);

export default Input;
