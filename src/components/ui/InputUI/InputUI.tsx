import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './InputUI.module.scss';

export const InputUI = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ id, className = '', type = 'text', ...props }, ref) => {
    const inputClassName = [styles.input, className].filter(Boolean).join(' ');

    return <input ref={ref} id={id} type={type} className={inputClassName} {...props} />;
  }
);

InputUI.displayName = 'InputUI';
