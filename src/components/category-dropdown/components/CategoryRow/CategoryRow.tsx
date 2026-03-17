import React from 'react';
import styles from './CategoryRow.module.scss';
import { CategoryIcon } from '@/components/ui/Icons/CategoryIcon';
import type { Category } from '@/data/categories';

interface CategoryRowProps {
  category: Category;
  onSelect: (value: string) => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ category, onSelect }) => {
  return (
    <div className={styles.categoryRow}>
      <button
        className={styles.iconButton}
        type="button"
        onClick={() => onSelect(category.title)}
        aria-label={category.title}
        data-testid={`category-icon-${category.title}`}
      >
        <CategoryIcon categoryTitle={category.title} />
      </button>

      <div className={styles.contentColumn}>
        <button
          className={styles.categoryButton}
          type="button"
          onClick={() => onSelect(category.title)}
          data-testid={`category-title-${category.title}`}
        >
          <span className={styles.categoryName}>{category.title}</span>
        </button>

        <ul className={styles.subcategoryList}>
          {category.subs.map((sub) => (
            <li key={sub}>
              <button
                className={styles.subcategoryButton}
                type="button"
                onClick={() => onSelect(sub)}
              >
                {sub}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
