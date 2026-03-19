import React from 'react';
import styles from './CatalogLoading.module.scss';

export const CatalogLoading: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner} />
      <p>Загрузка...</p>
    </div>
  );
};
