import React from 'react';
import styles from './SkillTag.module.scss';

export interface SkillTagProps {
  label: string;
  variant: 'teach' | 'learn';
  category?: 'education' | 'business' | 'art' | 'languages' | 'home' | 'health' | 'other';
  count?: number;
}

export const SkillTag: React.FC<SkillTagProps> = ({ label, variant, category, count }) => {
  const variantClass = styles[variant];
  const bgColorClass = category ? styles[category] : styles.other;

  return (
    <div className={`${styles.tag} ${variantClass} ${bgColorClass} `}>
      <span className={styles.label}>{label}</span>
      {count !== undefined && count > 0 && <span className={styles.count}>+{count}</span>}
    </div>
  );
};
