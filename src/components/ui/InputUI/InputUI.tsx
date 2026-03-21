import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './InputUI.module.scss';

export const InputUI = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ id, className = '', type = 'text', ...props }, ref) => {
    const inputClassName = [styles.input, className].filter(Boolean).join(' ');

    return <input id={id} ref={ref} type={type} className={inputClassName} {...props} />;
  }
);

InputUI.displayName = 'InputUI';
