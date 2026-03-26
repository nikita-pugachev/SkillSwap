import React from 'react';
import { Spinner } from '@/components/ui/Spinner';
import styles from './CatalogLoading.module.scss';

export const CatalogLoading: React.FC = () => {
  return (
    <div className={styles.loaderContainer} aria-live="polite">
      <Spinner size="lg" label="Загружаем каталог..." />
      <p>Загружаем каталог...</p>
    </div>
  );
};
