import React from 'react';
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
        <button className={styles.retryButton} onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  );
};
