import React from 'react';
import type { SkillCategorySlug } from '@/utils/types';
import styles from './SkillTag.module.scss';

export interface SkillTagProps {
  label: string;
  category?: SkillCategorySlug;
  count?: number;
}

export const SkillTag: React.FC<SkillTagProps> = ({ label, category, count }) => {
  const bgColorClass = category ? styles[category] : styles.other;

  return (
    <>
      <div className={`${styles.tag} ${bgColorClass}`}>
        <span>{label}</span>
      </div>
      {count !== undefined && count > 0 && <div className={styles.count}>+{count}</div>}
    </>
  );
};
