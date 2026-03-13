import React from 'react';
import styles from './SkillTag.module.scss';

export interface SkillTagProps {
  label: string;
  variant: 'teach' | 'learn';
  category?: 'education' | 'business' | 'art' | 'languages' | 'home' | 'health' | 'other';
  count?: number;
}

export const SkillTag: React.FC<SkillTagProps> = ({ label, variant, category, count }) => {
  const bgColorClass = category ? styles[category] : styles.other;

  return (
    <>
      <div className={`${styles.tag} ${bgColorClass}`} data-variant={variant}>
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && <div className={styles.count}>+{count}</div>}
    </>
  );
};
