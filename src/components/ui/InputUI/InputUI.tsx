import type { InputHTMLAttributes } from 'react';
import React from 'react';
import styles from './InputUI.module.scss';

export const InputUI: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  id,
  className = '',
  type = 'text',
  ...props
}) => {
  const inputClassName = [styles.input, className].filter(Boolean).join(' ');

  return <input id={id} type={type} className={inputClassName} {...props} />;
};
