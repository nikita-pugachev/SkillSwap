import React from 'react';
import styles from './Spinner.module.scss';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string; // текст для скринридеров
}

const sizeMap = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'Загрузка...' }) => {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <div className={`${styles.spinner} ${sizeMap[size]}`} />
    </div>
  );
};
