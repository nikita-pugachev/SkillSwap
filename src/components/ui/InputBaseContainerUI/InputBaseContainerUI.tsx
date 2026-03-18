import React from 'react';
import styles from './InputBaseContainerUI.module.scss';

type TInputBaseProps = {
  id?: string;
  label?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  isSearch?: boolean;
  className?: string;
  containerClassName?: string;
};

export const InputBaseContainerUI: React.FC<TInputBaseProps> = ({
  id,
  label,
  error,
  hint,
  children,
  isSearch = false,
  className,
  containerClassName,
}: TInputBaseProps) => {
  const inputBaseClassName = [styles.inputBase, isSearch ? styles.inputBaseSearch : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={[styles.inputBaseContainer, error ? styles.isError : '', containerClassName]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <label htmlFor={id} className={styles.labelInput}>
          {label}
        </label>
      )}
      <div className={inputBaseClassName}>{children}</div>
      {error ? (
        <p className={styles.errorInput}>{error}</p>
      ) : hint ? (
        <p className={styles.hintInput}>{hint}</p>
      ) : null}
    </div>
  );
};
