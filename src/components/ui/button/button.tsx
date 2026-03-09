import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...rest
}) => {
  const buttonClasses = [styles.button, styles[variant], disabled ? styles.disabled : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled} type={type} {...rest}>
      {children}
    </button>
  );
};
