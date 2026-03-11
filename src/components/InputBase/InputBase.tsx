import React from 'react';
import styles from './InputBase.module.scss';

type TInputBaseProps = {
  label?: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
};

export const InputBase = ({ label, error, hint, htmlFor, children }: TInputBaseProps) => {
  return (
    <div>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      <div className={styles.inputBaseContainer}>{children}</div>
      {hint && <p>{hint}</p>} {error && <p>{error}</p>}
    </div>
  );
};
