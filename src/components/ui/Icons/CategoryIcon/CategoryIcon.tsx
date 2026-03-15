import React from 'react';
import styles from './CategoryIcon.module.scss';

import businessIcon from '@/assets/icons/skills-category/icon-business-career.svg';
import languagesIcon from '@/assets/icons/skills-category/icon-languages.svg';
import homeIcon from '@/assets/icons/skills-category/icon-home.svg';
import artIcon from '@/assets/icons/skills-category/icon-art.svg';
import educationIcon from '@/assets/icons/skills-category/icon-education.svg';
import healthIcon from '@/assets/icons/skills-category/icon-health.svg';

const iconMap = {
  'Бизнес и карьера': businessIcon,
  'Иностранные языки': languagesIcon,
  'Дом и уют': homeIcon,
  'Творчество и искусство': artIcon,
  'Образование и развитие': educationIcon,
  'Здоровье и лайфстайл': healthIcon,
} as const;

const colorClassMap = {
  'Бизнес и карьера': styles.business,
  'Иностранные языки': styles.languages,
  'Дом и уют': styles.home,
  'Творчество и искусство': styles.art,
  'Образование и развитие': styles.education,
  'Здоровье и лайфстайл': styles.health,
} as const;

interface CategoryIconProps {
  categoryTitle: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryTitle, className = '' }) => {
  const iconSrc = iconMap[categoryTitle as keyof typeof iconMap];
  const colorClass = colorClassMap[categoryTitle as keyof typeof colorClassMap];

  if (!iconSrc || !colorClass) {
    console.warn(`Неизвестная категория "${categoryTitle}"`);
    return null;
  }

  return (
    <div className={`${styles.iconWrapper} ${colorClass} ${className}`}>
      <img src={iconSrc} alt="" className={styles.icon} width={24} height={24} aria-hidden="true" />
    </div>
  );
};
