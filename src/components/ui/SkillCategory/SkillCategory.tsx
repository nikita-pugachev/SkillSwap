import { CheckboxButton } from '../CheckboxButton';
import styles from './SkillCategory.module.scss';

import ChevronDown from '@/assets/icons/chevron-down.svg?react';
import ChevronUp from '@/assets/icons/chevron-up.svg?react';

import type { Skill } from '@/utils/types';

interface SkillCategoryProps {
  category: Skill;
  expanded: boolean;
  checkedSubcategories: number[];
  onToggleExpand: (categoryId: number) => void;
  onToggleCategoryCheckbox: (categoryId: number) => void;
  onToggleSubcategory: (categoryId: number, subcategoryId: number) => void;
}

export const SkillCategory = ({
  category,
  expanded,
  checkedSubcategories,
  onToggleExpand,
  onToggleCategoryCheckbox,
  onToggleSubcategory,
}: SkillCategoryProps) => {
  const checkedCount = category.subcategories.filter((sub) =>
    checkedSubcategories.includes(sub.id)
  ).length;
  const totalCount = category.subcategories.length;

  let categoryState: 'empty' | 'checked' | 'indeterminate' = 'empty';

  if (checkedCount === 0) {
    categoryState = 'empty';
  } else if (checkedCount === totalCount) {
    categoryState = 'checked';
  } else {
    categoryState = 'indeterminate';
  }

  return (
    <div className={styles.category}>
      <div className={styles.header}>
        <CheckboxButton
          label={category.title}
          state={categoryState}
          onChange={() => onToggleCategoryCheckbox(category.id)}
        />
        <button
          type="button"
          onClick={() => onToggleExpand(category.id)}
          className={`${styles.chevronButton} ${expanded ? styles.expanded : ''}`}
          aria-label={expanded ? 'Свернуть категорию' : 'Раскрыть категорию'}
        >
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {expanded && (
        <div className={styles.subcategories}>
          {category.subcategories.map((subcategory) => (
            <CheckboxButton
              key={subcategory.id}
              label={subcategory.title}
              state={checkedSubcategories.includes(subcategory.id) ? 'checked' : 'empty'}
              onChange={() => onToggleSubcategory(category.id, subcategory.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
