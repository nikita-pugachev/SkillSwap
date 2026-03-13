import React from 'react';
import styles from './InputBaseContainerUI.module.scss';

type TInputBaseProps = {
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  isSearch?: boolean;
};

export const InputBaseContainerUI: React.FC<TInputBaseProps> = ({
  id,
  label,
  error,
  hint,
  children,
  isSearch = false,
}: TInputBaseProps) => {
  const inputBaseClassName = [styles.inputBase, isSearch ? styles.inputBaseSearch : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.inputBaseContainer}>
      {label && (
        <label htmlFor={id} className={styles.labelInput}>
          {label}
        </label>
      )}
      <div className={inputBaseClassName}>{children}</div>
      {(hint || error) && <p>{[hint, error].filter(Boolean).join(' ')}</p>}
    </div>
  );
};
