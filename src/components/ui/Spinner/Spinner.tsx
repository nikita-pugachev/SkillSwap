import React from 'react';
import styles from './Spinner.module.scss';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.spinner} ${sizeMap[size]}`} />
    </div>
  );
};
