import type React from 'react';
import type { ButtonHTMLAttributes, JSX } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost-primary' | 'inverse' | 'ghost-inverse';
  customColor?: string;
  isSmall?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant,
  isSmall=false,
  customColor,
  isDisabled,
  children,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      className={clsx(
        styles.btn,
        variant && styles[`btn_${variant}`],
        isDisabled && styles['btn_disabled'],
        isSmall && styles['btn_small']
      )}
      style={customColor ? { backgroundColor: customColor } : undefined}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}
