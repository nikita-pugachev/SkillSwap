import React from 'react';
import styles from './CatalogEmpty.module.scss';

export const CatalogEmpty: React.FC = () => {
  return (
    <div className={styles.emptyContainer}>
      <h2 className={styles.emptyMessage}>По вашему запросу ничего не найдено</h2>
    </div>
  );
};
