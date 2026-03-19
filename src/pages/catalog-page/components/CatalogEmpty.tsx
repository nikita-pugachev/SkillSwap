import React from 'react';
import styles from './CatalogEmpty.module.scss';

interface CatalogEmptyProps {
  onResetFilters?: () => void;
}

export const CatalogEmpty: React.FC<CatalogEmptyProps> = ({ onResetFilters }) => {
  return (
    <div className={styles.emptyContainer}>
      <p className={styles.emptyMessage}>Ничего не найдено</p>
      {onResetFilters && (
        <button className={styles.resetButton} onClick={onResetFilters}>
          Сбросить фильтры
        </button>
      )}
    </div>
  );
};
