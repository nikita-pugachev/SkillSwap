import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from './CatalogError.module.scss';

interface CatalogErrorProps {
  message: string;
  onRetry?: () => void;
}

export const CatalogError: React.FC<CatalogErrorProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>Произошла ошибка: {message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Попробовать снова
        </Button>
      )}
    </div>
  );
};
