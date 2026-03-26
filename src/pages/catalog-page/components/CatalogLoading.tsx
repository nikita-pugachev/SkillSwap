import React from 'react';
import styles from './CatalogLoading.module.scss';

export const CatalogLoading: React.FC = () => {
  return (
    <div className={styles.loaderContainer} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p>Загружаем каталог...</p>
    </div>
  );
};
