import React from 'react';
import { Button } from '@/components/ui/ButtonUI';
import styles from './CatalogEmpty.module.scss';

interface CatalogEmptyProps {
  onResetFilters?: () => void;
}

export const CatalogEmpty: React.FC<CatalogEmptyProps> = ({ onResetFilters }) => {
  return (
    <div className={styles.emptyContainer}>
      <p className={styles.emptyMessage}>Ничего не найдено</p>
      {onResetFilters && (
        <Button variant="primary" onClick={onResetFilters}>
          Сбросить фильтры
        </Button>
      )}
    </div>
  );
};
