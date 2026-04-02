import type React from 'react';
import type { ButtonHTMLAttributes, JSX } from 'react';
import styles from './Button.module.css';
import { Link } from 'react-router-dom';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  customColor?: string;
  variant?: 'primary' | 'ghost-primary' | 'inverse' | 'ghost-inverse';
  isSmall?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
} & ({ isLink: true; to: string } | { isLink?: false; to?: never });

export default function Button({
  customColor,
  variant,
  isLink = false,
  isSmall = false,
  isDisabled = false,
  to,
  children,
  ...props
}: ButtonProps): JSX.Element {
  if (isLink) {
    return (
      <Link
        to={to!}
        className={`
          ${styles.btn} 
          ${variant ? styles[variant] : ''} 
          ${isSmall ? styles.small : ''} 
          ${props['className']}
        `}
        style={
          customColor
            ? {
                backgroundColor: customColor,
                border: `2px solid ${customColor}`,
              }
            : undefined
        }
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={`
        ${styles.btn}
        ${variant ? styles[variant] : ''} 
        ${isDisabled ? styles.disabled : ''} 
        ${isSmall ? styles.small : ''} 
        ${props['className']}
      `}
      style={
        customColor
          ? { backgroundColor: customColor, border: `2px solid ${customColor}` }
          : undefined
      }
      disabled={isDisabled}
    >
      {children}
    </button>
  );
}
