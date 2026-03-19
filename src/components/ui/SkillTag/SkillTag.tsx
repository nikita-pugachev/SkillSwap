import React from 'react';
import styles from './SkillTag.module.scss';

export interface SkillTagProps {
  label: string;
  category?: 'education' | 'business' | 'art' | 'languages' | 'home' | 'health' | 'other';
  count?: number;
}

export const SkillTag: React.FC<SkillTagProps> = ({ label, category, count }) => {
  const bgColorClass = category ? styles[category] : styles.other;
  const hasLabel = label.trim().length > 0;

  return (
    <>
      {hasLabel && (
        <div className={`${styles.tag} ${bgColorClass}`}>
          <span>{label}</span>
        </div>
      )}
      {count !== undefined && count > 0 && <div className={styles.count}>+{count}</div>}
    </>
  );
};
