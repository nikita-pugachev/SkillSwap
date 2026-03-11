import React from 'react';
import styles from './SkillTag.module.scss';

export interface SkillTagProps {
  label: string;
  variant: 'teach' | 'learn';
  category?: 'business' | 'art' | 'languages' | 'home' | 'health' | 'other';
  count?: number;
}

export const SkillTag: React.FC<SkillTagProps> = ({ label, variant, category, count }) => {
  const colorClass = variant === 'teach' && category ? styles[`teach-${category}`] : styles.learn;

  return (
    <div className={`${styles.tag} ${colorClass}`}>
      <span className={styles.label}>{label}</span>
      {count && count > 0 && <span className={styles.count}>+{count}</span>}
    </div>
  );
};
